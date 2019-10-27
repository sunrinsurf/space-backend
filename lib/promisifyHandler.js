function promisifyHandler(func, next) {
  func()
    .catch((e) => { next(e); });
}

module.exports = promisifyHandler;
