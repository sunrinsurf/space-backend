const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json({ extended: true }));

router.post("/", (req, res) => {
  //jwt token 발급
  var timeNowMil = Date.now();
  var tokenExpireTime;

  if (req.body.remember === "true") {
    //remember == true
    tokenExpireTime = timeNowMil + 604800000; //exptime = 7d
  } else {
    //remember == false
    tokenExpireTime = timeNowMil + 10800000; //exptime = 3h
  }
  const header = {
    typ: "JWT",
    alg: "HS256"
  };
  const encodedHeader = new Buffer(JSON.stringify(header))
    .toString("base64")
    .replace(/=/gi, "");

  const payload = {
    iss: "surfspace.me",
    exp: tokenExpireTime,
    userId: req.body.uid,
    username: req.body.name
  };

  const encodedPayload = new Buffer(JSON.stringify(payload))
    .toString("base64")
    .replace(/=/gi, "");
  const signature = crypto
    .createHmac("sha256", req.body.uid)
    .update(encodedHeader + "." + encodedPayload)
    .digest("base64")
    .replace(/=/gi, "");
  const result = encodedHeader + "." + encodedPayload + "." + signature;
  res.send(result);
});

router.post("/password", (req, res) => {});

module.exports = router;
