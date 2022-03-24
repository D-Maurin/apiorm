"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createTable_1 = __importStar(require("../../lib/createTable"));
const migrations_1 = __importDefault(require("../migrations"));
const item = (0, createTable_1.default)(migrations_1.default.refs.init, "items")
    .addColumn(migrations_1.default.refs.init, {
    name: "test",
    type: createTable_1.ColumnType.JSON,
})
    .addColumn(migrations_1.default.refs.test, {
    name: "test2",
    type: createTable_1.ColumnType.BOOLEAN,
})
    .dropColumn(migrations_1.default.refs.delete, "test")
    .addColumn(migrations_1.default.refs.onmore, {
    name: "onmore",
    type: createTable_1.ColumnType.JSON,
});
exports.default = item;
