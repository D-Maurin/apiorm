import { v4 as uuidv4 } from "uuid"
import migrations from "../database/migrations"

export enum ColumnType {
    UUID = "UUID",
    JSON = "JSON",
    STRING = "STRING",
    BOOLEAN = "BOOLEAN",
    NUMBER = "NUMBER",
}

type ColumnTypeMap = {
    UUID: string
    JSON: unknown
    STRING: string
    NUMBER: number
    BOOLEAN: boolean
}

type Column<T extends ColumnType, N extends string> = {
    name: N
    type: T
    required?: boolean
    default?: () => ColumnTypeMap[T]
}

type MigrationQueries = {
    up: string
    down?: string
}

const getPGType = (colType: ColumnType) => {
    switch (colType) {
        case ColumnType.BOOLEAN:
            return "boolean"
        case ColumnType.NUMBER:
            return "bigint"
        case ColumnType.JSON:
            return "json"
        case ColumnType.STRING:
            return "varchar"
        case ColumnType.UUID:
            return "uuid"
    }

    ;((x: never) => null)(colType) // exhaustive check
}

export class Table<Cs extends object, P> {
    name: string
    migRef: number
    columns: Cs
    queries: MigrationQueries
    prev: P

    constructor(
        name: string,
        migRef: number,
        prev: P,
        cols: Cs,
        queries: MigrationQueries
    ) {
        this.name = name
        this.migRef = migRef
        this.queries = queries
        this.columns = cols
        this.prev = prev
    }

    addColumn<T extends ColumnType, N extends string>(
        migRef: number,
        col: Column<T, N>
    ) {
        return new Table(
            this.name,
            migRef,
            this,
            {
                ...this.columns,
                ...({ [col.name]: col } as { [key in N]: Column<T, N> }),
            },
            {
                up: `ALTER TABLE ${this.name}
                ADD COLUMN ${col.name} ${getPGType(col.type)} ${
                    col.required ? "NOT NULL" : ""
                }`,
                down: `ALTER TABLE ${this.name}
                DROP COLUMN ${col.name}`,
            }
        )
    }

    dropColumn<N extends keyof Cs>(migRef: number, colName: N) {
        const { [colName]: _todelete, ...keep } = this.columns

        return new Table(this.name, migRef, this, keep, {
            up: `ALTER TABLE ${this.name} 
            DROP COLUMN ${colName}`,
        })
    }

    static create(migRef: number, tableName: string) {
        return new Table<{}, undefined>(
            tableName,
            migRef,
            undefined,
            {},
            {
                up: `CREATE TABLE ${tableName} ()`,
                down: `DROP TABLE ${tableName}`,
            }
        )
    }
}

const createTable = (migRef: number, tableName: string) => {
    return Table.create(migRef, tableName)
        .addColumn(migRef, {
            name: "id",
            type: ColumnType.UUID,
            required: true,
            default: uuidv4,
        })
        .addColumn(migRef, {
            name: "updated_at",
            type: ColumnType.NUMBER,
            required: true,
            default: Date.now,
        })
        .addColumn(migRef, {
            name: "created_at",
            type: ColumnType.NUMBER,
            required: true,
            default: Date.now,
        })
}

export type TableType<Tab> = Tab extends Table<infer X, unknown>
    ? {
          [key in keyof X]: X[key] extends Column<infer T, string>
              ? ColumnTypeMap[X[key]["type"]]
              : never
      }
    : never

export default createTable
