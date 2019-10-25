function promisifyHandler(func) {
    try {
        func();
    } catch (e) {
        throw e;
    }
}

module.exports = promisifyHandler;