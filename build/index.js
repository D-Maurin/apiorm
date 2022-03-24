"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("./database/connection"));
const migrations_1 = __importDefault(require("./database/migrations"));
const models_1 = __importDefault(require("./database/models"));
const createMigrator_1 = __importDefault(require("./lib/createMigrator"));
const migrator = (0, createMigrator_1.default)(connection_1.default, models_1.default, migrations_1.default).then((mig) => mig.up());
