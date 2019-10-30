// /auth/index.js

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const util = require('util');
const crypto = require('crypto');
const throwError = require('../../lib/throwError');
const User = require('../../models/user');
const throwError = require('../../lib/throwError');

router.use(bodyParser.json({ extended: true }));

router.post('/', async (req, res, next) => {
  try {
    const { uid, password, remember } = req.body;
    const user = await User.findOne({ uid });
    if (!user) return throwError('아이디가 없거나 비밀번호가 다릅니다.', 403);

    const userSalt = user.enckey;
    const userPassword = user.password;

    const pbkdf2 = util.promisify(crypto.pbkdf2);
    const key = await pbkdf2(password, userSalt, 100000, 64, 'sha512');

    const clientPassword = key.toString('base64');
    if (clientPassword !== userPassword)
      return throwError('아이디가 없거나 비밀번호가 다릅니다.', 403);

    let tokenExpireTime;
    if (remember === true) {
      // remember == true
      tokenExpireTime = 604800; // exptime = 7d
    } else {
      // remember == false
      tokenExpireTime = 10800; // exptime = 3h
    }
    const payload = {
      userId: user.uid,
      username: user.name
    };
    const result = jwt.sign(payload, settings.TOKEN_KEY || 'jwt', {
      expiresIn: tokenExpireTime,
      issuer: 'surfspace.me'
    });
    res.status(201).json({ token: result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
