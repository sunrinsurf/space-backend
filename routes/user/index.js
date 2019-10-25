// /user/index.js

const express = require("express");
const util = require('util');
const router = express.Router();
const crypto = require("crypto");
const bodyParser = require("body-parser");
const throwError = require("../../lib/throwError");
const sendLog = require("../../lib/sendLog");
const phoneCert = require("../../lib/PhoneCertToken");
const promisifyHandler = require('../../lib/promisifyHandler');
const User = require('../../models/user');

require("dotenv").config();

router.use(bodyParser.json());

function getDate() {
  const currentdate = new Date();
  const datetime =
    currentdate.getFullYear() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getDate() +
    " - " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  return datetime;
};

router.post("/", (req, res) => {
  //register
  promisifyHandler(async () => {
    //promisify
    const randomBytes = util.promisify(crypto.randomBytes);
    const pbkdf2 = util.promisify(crypto.pbkdf2);

    try {
      const buf = await randomBytes(64)
      const key = await pbkdf2(req.body.password, buf.toString('base64'), 100000, 64, "sha512");

      const Ukey = buf.toString('base64');
      const Upw = key.toString("base64");
      // 가끔가다가 crypto에서 잘못된 값을 전달해주는 경우가 있어 확인절차
      const testKey = await pbkdf2(req.body.password, Ukey, 100000, 64, "sha512");
      if (Upw !== testKey.toString("base64")) {
        return throwError(
          "Error while register : Password Key initial comparation failed!",
          500,
          { logError: true }
        );
      }
    } catch (e) {
      return throwError("암호화에 실패했습니다.", 500);
    }

    if (!phoneCert.verifyToken(req.body.ptoken, req.body.phone)) {
      return throwError("올바른 휴대폰 인증 정보가 아닙니다.", 500);
    }
    const somethingStr = req.body.something || "NULL";
    const user = new User({
      //making an object for insertion
      uid: req.body.uid,
      password: Upw,
      enckey: Ukey,
      nickname: req.body.nickname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      interest: req.body.interest,
      regdate: getDate(),
      shareitem: [],
      transhistory: [],
      something: somethingStr
    });
    try {
      await user.save();
    } catch (e) {
      return throwError("DB 저장을 실패했습니다.", 500);
    }
    res.json({
      success: true
    });
  });
});

router.post("/overlap", (req, res) => {
  promisifyHandler(async () => {
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
  })
});

router.get("/:id", (req, res) => { });

module.exports = router;
