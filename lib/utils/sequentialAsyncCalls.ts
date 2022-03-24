const sequentialAsyncCalls = async (funcs: (() => Promise<void>)[]) => {
    if (!funcs.length) return

    const [current, ...others] = funcs
    await current()
    await sequentialAsyncCalls(others)
}

export default sequentialAsyncCalls
