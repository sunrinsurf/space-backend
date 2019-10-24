const express = require("express");
const router = express.Router();
const getRandomNumber = require("../../../lib/getRandomNumber");
const AWS = require("aws-sdk");
const sns = new AWS.SNS({ region: "us-east-1" });
const throwError = require("../../../lib/throwError");
const crypto = require("crypto");

const key = "phone-number-hidden-key";
router.post("/", (req, res) => {
  const { phone } = req.body;
  const code = getRandomNumber(6);
  const params = {
    Message: `Space 인증 번호: [${code}]`,
    PhoneNumber: phone
  };

  const chiper = crypto.createCipher("aes-256-gcm", key);

  let token = chiper.update(JSON.stringify({ phone, code }), "utf8", "base64");
  token += chiper.final("base64");
  sns
    .publish(params)
    .promise()
    .then(() => {
      res.json({ success: true });
    })
    .catch(e => {
      console.error(e);
      throwError("오류가 발생했습니다. 다시 시도해주세요.", 500);
    });
});
module.exports = router;
