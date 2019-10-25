function promisifyHandler(func) {
    func()
        .catch(e => { throw e; })
}

module.exports = promisifyHandler;