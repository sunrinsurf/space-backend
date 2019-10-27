const express = require("express");

const router = express.Router();
const AWS = require("aws-sdk");
const crypto = require("crypto");

const sns = new AWS.SNS({ region: "us-east-1" });
const throwError = require("../../../lib/throwError");
const getRandomNumber = require("../../../lib/getRandomNumber");

const PhoneCertToken = require("../../../lib/PhoneCertToken");
const User = require('../../../models/user');

const key = settings.PHONE_KEY || "phone-number-hidden-key";
function codeCrypto(code) {
  return crypto
    .pbkdf2Sync(code.toString(), key.toString("base64"), 100000, 64, "sha512")
    .toString("base64");
}

function formatPhone(phone) {
  let PhoneNumber = phone.replace(/[^0-9]/g, "");
  if (PhoneNumber.length !== 11) {
    return throwError("전화번호 형식에 맞지 않습니다.");
  }
  PhoneNumber = `+82${PhoneNumber.slice(1)}`;
  return PhoneNumber;
}
function formatNormalPhone(str) {
  const data = str.replace(/-/g, "");
  const [num1, num2, num3] = [
    data.slice(0, 3),
    data.slice(3, 7),
    data.slice(7, 11),
  ];
  let n = num1;
  if (num2) {
    n += `-${num2}`;
  }
  if (num3) {
    n += `-${num3}`;
  }
  return n;
}
router.post("/", async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return throwError("휴대폰 번호는 필수입니다.", 400);
    }
    const PhoneNumber = formatPhone(phone);
    console.log(PhoneNumber);
    const user = await User.findOne({ phone: formatNormalPhone(phone) });
    if (user) {
      return throwError("이미 있는 유저입니다.", 422);
    }
    const code = process.env.NODE_ENV === 'test' && req.query.code ? req.query.code : getRandomNumber(6);
    const params = {
      Message: `Space 인증 번호: [${code}]`,
      PhoneNumber,
    };
    const cryptedCode = codeCrypto(code);

    const chiper = crypto.createCipher("aes-256-gcm", key);
    const time = process.env.NODE_ENV === 'test' && req.query.time ? parseInt(req.query.time) : new Date().getTime();
    let token = chiper.update(
      JSON.stringify({ phone, code: cryptedCode, time }),
      "utf8",
      "base64",
    );
    token += chiper.final("base64");
    const handler = process.env.NODE_ENV !== 'test' && sns
      .publish(params)
      .promise();
    try {
      await Promise.resolve(handler);
      res.json({ success: true, token });
    } catch (e) {
      console.error(e);
      throwError("오류가 발생했습니다. 다시 시도해주세요.", 500);
    }
  } catch (e) { next(e); }
});
router.put("/:code", (req, res) => {
  const cryptedCode = codeCrypto(req.params.code);
  const { phone, token } = req.body;

  if (!phone) return throwError("전화번호가 필요합니다.", 400);
  if (!token) return throwError("토큰이 필요합니다.", 400);

  const dechiper = crypto.createDecipher("aes-256-gcm", key);
  let data = dechiper.update(token, "base64", "utf8");
  data = JSON.parse(data);
  if (formatPhone(data.phone) !== formatPhone(phone)) {
    return throwError("전화번호가 같지 않습니다.", 403);
  }
  if (data.code !== cryptedCode) {
    return throwError("코드가 같지 않습니다.", 403);
  }
  if (data.time + 1000 * 60 * 3 < new Date().getTime()) {
    return throwError("3분이 지난 코드입니다.", 403);
  }

  res.json({ success: true, token: PhoneCertToken.generateToken(phone) });
});
module.exports = router;
