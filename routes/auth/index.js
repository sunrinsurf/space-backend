// /auth/index.js

const express = require("express");

const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");
const User = require("../../models/user");

router.use(bodyParser.json({ extended: true }));

router.post("/", (req, res) => {
  let tokenExpireTime;
  if (req.body.remember === true) {
    //remember == true
    tokenExpireTime = 604800; //exptime = 7d
  } else {
    //remember == false
    tokenExpireTime = 10800; //exptime = 3h
  }
  const payload = {
    userId: req.body.uid,
    username: req.body.name,
  };
  const result = jwt.sign(payload, req.body.uid, {
    expiresIn: tokenExpireTime,
    issuer: "surfspace.me",
  });
  res.send(result);
});

router.post("/login", async (req, res) => {
  const { uid, password } = req.body;
  const user = await User.findOne({ uid });

  const userSalt = user.enckey;
  const userPassword = user.password;

  if (userKey === undefined) {
    res.send(false);
  }
  const pbkdf2 = util.promisify(crypto.pbkdf2);

  const key = await pbkdf2(password, userSalt, 100000, 64, "sha512");

  const clientPassword = key.toString("base64");

  if (clientPassword !== userPassword) {
    res.send(false);
  } else res.send(true);
});

router.post("/password", (req, res) => {
  res.send("notUsing");
});

module.exports = router;
