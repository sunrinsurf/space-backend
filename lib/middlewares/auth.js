const jwt = require('jsonwebtoken');

exports.authroized = (req, res, next) => {
  let token;
  try {
    token = req.headers['x-access-token'];
  } catch (e) {
    return throwError('필수 항목이 입력되지 않았습니다.', 400);
  }
  try {
    jwt.verify(token, settings.TOKEN_KEY || 'jwt');
    next();
  } catch (e) {
    return throwError('올바른 토큰이 아닙니다.', 403);
  }
};
