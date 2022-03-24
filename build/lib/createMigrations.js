"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrations = void 0;
class Migrations {
    constructor(list) {
        const refsEntries = list.map((i) => [i.name, i.date]);
        this.refs = Object.fromEntries(refsEntries);
        this.list = list;
    }
    add(mig) {
        return new Migrations([...this.list, mig]);
    }
}
exports.Migrations = Migrations;
const createMigrations = () => {
    return new Migrations([]);
};
exports.default = createMigrations;
