"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequentialAsyncCalls = async (funcs) => {
    if (!funcs.length)
        return;
    const [current, ...others] = funcs;
    await current();
    await sequentialAsyncCalls(others);
};
exports.default = sequentialAsyncCalls;
