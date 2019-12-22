// /user/index.js

const express = require('express');
const util = require('util');

const router = express.Router();
const crypto = require('crypto');
const bodyParser = require('body-parser');
const throwError = require('../../lib/throwError');
const phoneCert = require('../../lib/PhoneCertToken');
const User = require('../../models/user');
const Product = require('../../models/product');
const auth = require('../../lib/middlewares/auth');
const jwt = require('jsonwebtoken');

require('dotenv').config();

router.use(bodyParser.json());

router.post('/', async (req, res, next) => {
  try {
    const {
      uid,
      password,
      ptoken,
      phone,
      nickname,
      email,
      interest,
      address,
      profileImage
    } = req.body;
    // promisify
    const randomBytes = util.promisify(crypto.randomBytes);
    const pbkdf2 = util.promisify(crypto.pbkdf2);

    const buf = await randomBytes(64);
    const key = await pbkdf2(
      password,
      buf.toString('base64'),
      100000,
      64,
      'sha512'
    );

    const Ukey = buf.toString('base64');
    const Upw = key.toString('base64');

    const examinePasswordIsEnabled = process.env.EXAMINE_PASSWORD || false;
    if (examinePasswordIsEnabled) {
      // 가끔가다가 crypto에서 잘못된 값을 전달해주는 경우가 있어 확인절차
      const testKey = await pbkdf2(password, Ukey, 100000, 64, 'sha512');
      if (Upw !== testKey.toString('base64')) {
        return throwError('암호화 도중 검증에 실패했습니다.', 500, {
          logError: true
        });
      }
    }
    if (
      process.env.NODE_ENV !== 'test' &&
      !phoneCert.verifyToken(ptoken, phone)
    ) {
      return throwError('올바른 휴대폰 인증 정보가 아닙니다.', 500);
    }
    const verifyUser = await User.findOne().or([{ uid }, { phone }, { email }]);

    if (verifyUser) {
      return throwError('이미 존재하는 유저입니다.', 422);
    }

    const user = new User({
      // making an object for insertion
      uid,
      password: Upw,
      enckey: Ukey,
      nickname,
      email,
      phone,
      address,
      staticInterest: interest,
      interest,
      profileImage
    });
    try {
      await user.save();
    } catch (e) {
      console.error(e);
      return throwError('DB 저장을 실패했습니다.', 500);
    }
    res.status(201).json({
      success: true
    });
  } catch (e) {
    next(e);
  }
});

router.post('/overlap', async (req, res, next) => {
  try {
    let { type, content } = req.body;
    if (!type || content === undefined) {
      return throwError('필수 항목이 필요합니다.', 400);
    }
    const typeArray = ['id', 'phone', 'email'];

    if (typeArray.indexOf(type) === -1) {
      console.log(type);
      return throwError('입력 값이 잘못되었습니다.', 400);
    }
    if (type === 'id') {
      type = 'uid';
    }
    const query = { [type]: content };
    const user = await User.findOne(query);
    res.json({ overlap: !!user });
  } catch (e) {
    next(e);
  }
});

router.get('/:id', auth.authroized, async (req, res, next) => {
  try {
    let query = { uid: req.params.id };
    if (!query) {
      return throwError('필수 항목이 입력되지 않았습니다.');
    }

    const result = await User.findOne(query);
    if (!result) {
      return throwError('ID가 존재하지 않습니다.', 400);
    }
    const invitedProducts = await Product.find({
      participant: {
        $in: [result._id]
      }
    });
    const createdProducts = await Product.find({
      owner: result._id
    });
    const sendResult = {
      uid: result.uid,
      nickname: result.nickname,
      email: result.email,
      phone: result.phone,
      address: result.address,
      interest: result.interest,
      profileImage: result.profileImage,
      invitedProducts,
      createdProducts
    };
    res.json(sendResult);
  } catch (e) {
    next(e);
  }
});
router.get('/:id/interest', auth.authroized, async (req, res, next) => {
  try {
    const user = await User.findOne({ uid: req.params.id }, ['interest']);

    if (!user) {
      return throwError('유저를 찾을 수 없습니다.', 404);
    }

    res.json({ categorys: user.interest });
  } catch (e) {
    next(e);
  }
});

// profile modifys
router.put('/profileImage', auth.authroized, async (req, res, next) => {
  try {
    const { profileImage } = req.body;
    if (!profileImage) {
      return throwError('profileImage 필드가 필요합니다.', 400);
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return throwError('존재하지 않는 유저입니다.', 404);
    }
    user.profileImage = profileImage;
    await user.save();
    res.json({
      success: true
    });
  } catch (e) {
    next(e);
  }
});
router.put('/nickname', auth.authroized, async (req, res, next) => {
  try {
    const { nickname } = req.body;
    if (!nickname) return throwError('nickname 필드가 필요합니다.');
    const user = await User.findById(req.user._id);
    if (!user) return throwError('존재하지 않는 유저입니다.', 404);

    user.nickname = nickname;
    await user.save();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});
router.put('/interest', auth.authroized, async (req, res, next) => {
  try {
    const { interest } = req.body;
    if (!interest) return throwError('interest 필드가 필요합니다.');
    const user = await User.findById(req.user._id);
    if (!user) return throwError('존재하지 않는 유저입니다.', 404);

    user.interest = interest;
    await user.save();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
