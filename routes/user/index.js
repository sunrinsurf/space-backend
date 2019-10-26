// /user/index.js

const express = require("express");
const util = require('util');
const router = express.Router();
const crypto = require("crypto");
const bodyParser = require("body-parser");
const throwError = require("../../lib/throwError");
const sendLog = require("../../lib/sendLog");
const phoneCert = require("../../lib/PhoneCertToken");
const User = require('../../models/user');

require("dotenv").config();

router.use(bodyParser.json());

router.post("/", async (req, res, next) => {
  try {
    const { uid, password, ptoken, phone, something, nickname, email, interest, address } = req.body;
    //promisify
    const randomBytes = util.promisify(crypto.randomBytes);
    const pbkdf2 = util.promisify(crypto.pbkdf2);

    const buf = await randomBytes(64)
    const key = await pbkdf2(password, buf.toString('base64'), 100000, 64, "sha512");

    const Ukey = buf.toString('base64');
    const Upw = key.toString("base64");
    // 가끔가다가 crypto에서 잘못된 값을 전달해주는 경우가 있어 확인절차
    const testKey = await pbkdf2(password, Ukey, 100000, 64, "sha512");
    if (Upw !== testKey.toString("base64")) {
      return throwError(
        "Error while register : Password Key initial comparation failed!",
        500,
        { logError: true }
      );
    }

    if (process.env.NODE_ENV !== 'test' && !phoneCert.verifyToken(ptoken, phone)) {
      return throwError("올바른 휴대폰 인증 정보가 아닙니다.", 500);
    }
    const somethingStr = something || "NULL";
    const user = new User({
      //making an object for insertion
      uid,
      password: Upw,
      enckey: Ukey,
      nickname,
      email,
      phone,
      address,
      interest,
      something: somethingStr
    });
    try {
      await user.save();
    } catch (e) {
      console.error(e)
      return throwError("DB 저장을 실패했습니다.", 500);
    }
    res.status(201).json({
      success: true
    });
  } catch (e) {
    next(e);
  }
});

router.post("/overlap", async (req, res, next) => {
  try {
    const { type, content } = req.body;
    if (!type || content === undefined) {
      return throwError(`필수 항목이 필요합니다.`, 400);
    }
    let query = {};
    switch (type) {
      case "id":
        query.uid = content;
        break;
      case "phone":
        query.phone = content;
        break;
      case "email":
        query.email = content;
        break;
      default:
        throwError("비교할 수 있는 대상이 아닙니다.", 400);
    }
    const user = await User.findOne(query);
    res.json({ overlap: !!user });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", (req, res) => { });

module.exports = router;
