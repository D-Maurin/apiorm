"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const db = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
exports.default = db;
