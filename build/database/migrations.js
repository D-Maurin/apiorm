"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createMigrations_1 = __importDefault(require("../lib/createMigrations"));
const migrations = (0, createMigrations_1.default)()
    .add({
    name: "init",
    description: "Initialisation",
    date: 1646937859,
})
    .add({
    name: "test",
    description: "Description",
    date: 1647960559,
})
    .add({
    name: "delete",
    description: "willdelete",
    date: 1647962070,
})
    .add({
    name: "onmore",
    description: "A lon gdesc",
    date: 1647962071,
});
exports.default = migrations;
