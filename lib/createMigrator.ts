import { Pool } from "pg"
import { Migrations } from "./createMigrations"
import { Table } from "./createTable"
import sequentialAsyncCalls from "./utils/sequentialAsyncCalls"

const MIGRATOR_TABLE_NAME = "_migrator_"

const cleanQuery = (q: string) => {
    return q.replace(/\n/g, " ").replace(/ +/g, " ")
}

export const runQueries = async (
    migRef: number,
    model: Table<any, any>,
    direction: "up" | "down",
    db: Pool
) => {
    if (!model) return

    if (direction === "up") {
        await runQueries(migRef, model.prev, direction, db)
    }

    if (model.migRef === migRef) {
        const query = model.queries[direction]
        if (!query) {
            throw "Not revertible"
        }
        const cleanedQuery = cleanQuery(query)
        console.log(`Exec ${cleanedQuery}`)
        await db.query(cleanedQuery)
    }

    if (direction === "down") {
        await runQueries(migRef, model.prev, direction, db)
    }
}

class Migrator {
    db: Pool
    models: Table<any, any>[]
    migrations: Migrations<any>

    constructor(
        db: Pool,
        models: Table<any, any>[],
        migrations: Migrations<any>
    ) {
        this.db = db
        this.models = models
        this.migrations = migrations
    }

    async init() {
        const res = await this.db.query(`
        SELECT EXISTS (
            SELECT FROM 
                pg_tables
            WHERE 
                schemaname = 'public' AND 
                tablename  = '${MIGRATOR_TABLE_NAME}'
            )`)

        const synced = res.rows[0].exists
        if (!synced) {
            await this.db.query(`
            CREATE TABLE ${MIGRATOR_TABLE_NAME} (
                key VARCHAR PRIMARY KEY NOT NULL,
                value JSON
            )`)
            await this.db.query(`
            INSERT INTO ${MIGRATOR_TABLE_NAME}(key, value) VALUES 
                ('last_migration', '0'),
                ('migrations', '[]')
            `)
        }
    }

    async up() {
        const res = await this.db.query(
            `SELECT value FROM ${MIGRATOR_TABLE_NAME} WHERE key='migrations'`
        )

        const migrationsRefs = res.rows[0].value as number[]

        migrationsRefs.forEach((migrationRef, index) => {
            if (migrationRef !== this.migrations.list[index].date) {
                throw "tree fail"
            }
        })

        sequentialAsyncCalls(
            this.migrations.list.map((migration) => {
                // Execute complete migration
                return async () => {
                    if (!migrationsRefs.includes(migration.date)) {
                        console.log(`=== Migration "${migration.name}" ===`)
                        console.log(migration.description)
                        console.log(`=== Start`)
                        await sequentialAsyncCalls(
                            this.models.map((model) => {
                                return async () =>
                                    await runQueries(
                                        migration.date,
                                        model,
                                        "up",
                                        this.db
                                    )
                            })
                        )
                        console.log(`=== End`)
                    }
                }
            })
        )

        await this.db.query(
            `UPDATE ${MIGRATOR_TABLE_NAME} SET value=$1 WHERE key='migrations'`,
            [JSON.stringify(this.migrations.list.map((m) => m.date))]
        )
    }
}

const createMigrator = async (
    db: Pool,
    models: Table<any, any>[],
    migrations: Migrations<any>
) => {
    const migrator = new Migrator(db, models, migrations)
    await migrator.init()
    return migrator
}

export default createMigrator
