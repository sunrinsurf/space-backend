// /user/index.js

const express = require('express');
const util = require('util');

const router = express.Router();

const bodyParser = require('body-parser');
const throwError = require('../../lib/throwError');
const analyzer = require('../../lib/middlewares/analyzeInterest');

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
  try {
    const result = analyzer();
    res.send(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
