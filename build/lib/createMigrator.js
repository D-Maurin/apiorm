"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQueries = void 0;
const sequentialAsyncCalls_1 = __importDefault(require("./utils/sequentialAsyncCalls"));
const MIGRATOR_TABLE_NAME = "_migrator_";
const cleanQuery = (q) => {
    return q.replace(/\n/g, " ").replace(/ +/g, " ");
};
const runQueries = async (migRef, model, direction, db) => {
    if (!model)
        return;
    if (direction === "up") {
        await (0, exports.runQueries)(migRef, model.prev, direction, db);
    }
    if (model.migRef === migRef) {
        const query = model.queries[direction];
        if (!query) {
            throw "Not revertible";
        }
        const cleanedQuery = cleanQuery(query);
        console.log(`Exec ${cleanedQuery}`);
        await db.query(cleanedQuery);
    }
    if (direction === "down") {
        await (0, exports.runQueries)(migRef, model.prev, direction, db);
    }
};
exports.runQueries = runQueries;
class Migrator {
    constructor(db, models, migrations) {
        this.db = db;
        this.models = models;
        this.migrations = migrations;
    }
    async init() {
        const res = await this.db.query(`
        SELECT EXISTS (
            SELECT FROM 
                pg_tables
            WHERE 
                schemaname = 'public' AND 
                tablename  = '${MIGRATOR_TABLE_NAME}'
            )`);
        const synced = res.rows[0].exists;
        if (!synced) {
            await this.db.query(`
            CREATE TABLE ${MIGRATOR_TABLE_NAME} (
                key VARCHAR PRIMARY KEY NOT NULL,
                value JSON
            )`);
            await this.db.query(`
            INSERT INTO ${MIGRATOR_TABLE_NAME}(key, value) VALUES 
                ('last_migration', '0'),
                ('migrations', '[]')
            `);
        }
    }
    async up() {
        const res = await this.db.query(`SELECT value FROM ${MIGRATOR_TABLE_NAME} WHERE key='migrations'`);
        const migrationsRefs = res.rows[0].value;
        migrationsRefs.forEach((migrationRef, index) => {
            if (migrationRef !== this.migrations.list[index].date) {
                throw "tree fail";
            }
        });
        (0, sequentialAsyncCalls_1.default)(this.migrations.list.map((migration) => {
            // Execute complete migration
            return async () => {
                if (!migrationsRefs.includes(migration.date)) {
                    console.log(`=== Migration "${migration.name}" ===`);
                    console.log(migration.description);
                    console.log(`=== Start`);
                    await (0, sequentialAsyncCalls_1.default)(this.models.map((model) => {
                        return async () => await (0, exports.runQueries)(migration.date, model, "up", this.db);
                    }));
                    console.log(`=== End`);
                }
            };
        }));
        await this.db.query(`UPDATE ${MIGRATOR_TABLE_NAME} SET value=$1 WHERE key='migrations'`, [JSON.stringify(this.migrations.list.map((m) => m.date))]);
    }
}
const createMigrator = async (db, models, migrations) => {
    const migrator = new Migrator(db, models, migrations);
    await migrator.init();
    return migrator;
};
exports.default = createMigrator;
