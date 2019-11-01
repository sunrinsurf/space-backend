// /chat/index.js

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
  try {
    c;
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    console;
  } catch (e) {
    next(e);
  }
});

module.exports = router;
