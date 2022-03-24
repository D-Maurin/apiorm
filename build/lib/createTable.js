"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = exports.ColumnType = void 0;
const uuid_1 = require("uuid");
var ColumnType;
(function (ColumnType) {
    ColumnType["UUID"] = "UUID";
    ColumnType["JSON"] = "JSON";
    ColumnType["STRING"] = "STRING";
    ColumnType["BOOLEAN"] = "BOOLEAN";
    ColumnType["NUMBER"] = "NUMBER";
})(ColumnType = exports.ColumnType || (exports.ColumnType = {}));
const getPGType = (colType) => {
    switch (colType) {
        case ColumnType.BOOLEAN:
            return "boolean";
        case ColumnType.NUMBER:
            return "bigint";
        case ColumnType.JSON:
            return "json";
        case ColumnType.STRING:
            return "varchar";
        case ColumnType.UUID:
            return "uuid";
    }
    ;
    ((x) => null)(colType); // exhaustive check
};
class Table {
    constructor(name, migRef, prev, cols, queries) {
        this.name = name;
        this.migRef = migRef;
        this.queries = queries;
        this.columns = cols;
        this.prev = prev;
    }
    addColumn(migRef, col) {
        return new Table(this.name, migRef, this, {
            ...this.columns,
            ...{ [col.name]: col },
        }, {
            up: `ALTER TABLE ${this.name}
                ADD COLUMN ${col.name} ${getPGType(col.type)} ${col.required ? "NOT NULL" : ""}`,
            down: `ALTER TABLE ${this.name}
                DROP COLUMN ${col.name}`,
        });
    }
    dropColumn(migRef, colName) {
        const { [colName]: _todelete, ...keep } = this.columns;
        return new Table(this.name, migRef, this, keep, {
            up: `ALTER TABLE ${this.name} 
            DROP COLUMN ${colName}`,
        });
    }
    static create(migRef, tableName) {
        return new Table(tableName, migRef, undefined, {}, {
            up: `CREATE TABLE ${tableName} ()`,
            down: `DROP TABLE ${tableName}`,
        });
    }
}
exports.Table = Table;
const createTable = (migRef, tableName) => {
    return Table.create(migRef, tableName)
        .addColumn(migRef, {
        name: "id",
        type: ColumnType.UUID,
        required: true,
        default: uuid_1.v4,
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
    });
};
exports.default = createTable;
