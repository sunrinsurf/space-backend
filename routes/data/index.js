// /user/index.js

const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');
const analyzer = require('../../lib/middlewares/analyzeInterest');
const Data = require('../../models/data');

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
  try {

    const rawResult = await Data.findOne({ _id: '5db8e6b6042ec77665f03b5f' });

    const result = { interestRank: rawResult.interestRank };
    res.json(result);
  } catch (e) {
    next(e);
  }
});

//analyze 

router.get('/analyze', (req, res, next) => {
  try {
    analyzer(); //1주일에 한번정도 analyze 돌려야함

    res.send(true);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
