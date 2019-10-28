const jwt = require('jsonwebtoken');
const throwError = require('../throwError');

exports.authroized = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token) return throwError('필수 항목이 입력되지 않았습니다.', 400);
  try {
    const token = jwt.verify(token, settings.TOKEN_KEY || 'jwt');
    req.locals.user = token;
    next();
  } catch (e) {
    return throwError('올바른 토큰이 아닙니다.', 403);
  }
};
