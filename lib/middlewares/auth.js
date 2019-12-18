const verifyToken = require('../verifyToken');
const throwError = require('../throwError');

exports.authroized = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token) return throwError('필수 항목이 입력되지 않았습니다.', 400);
  try {
    const tokenData = verifyToken(token);
    req.user = tokenData;
    next();
  } catch (e) {
    console.error(e);
    return throwError('올바른 토큰이 아닙니다.', 403);
  }
};

exports.parseAutorized = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token) return next();
  try {
    const tokenData = verifyToken(token);
    req.user = tokenData;
    next();
  } catch (e) {
    console.error(e);
    return throwError('올바른 토큰이 아닙니다.', 403);
  }
};
