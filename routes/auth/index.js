const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
router.use(bodyParser.json({ extended: true }));

router.post("/", (req, res) => {
  let timeNowMil = Date.now();
  let tokenExpireTime;

  if (req.body.remember === "true") {
    //remember == true
    tokenExpireTime = timeNowMil + 604800000; //exptime = 7d
  } else {
    //remember == false
    tokenExpireTime = timeNowMil + 10800000; //exptime = 3h
  }

  const payload = {
    userId: req.body.uid,
    username: req.body.name
  };
  const result = jwt.sign(payload, req.body.uid, {
    expiresIn: tokenExpireTime,
    issuer: 'surfspace.me'
  });
  res.send(result);
});

router.post("/password", (req, res) => { });

module.exports = router;
