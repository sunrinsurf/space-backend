// /user/index.js

const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');
const analyzer = require('../../lib/middlewares/analyzeInterest');
const Data = require('../../models/data');
const throwError = require('../../lib/throwError');
const analyzeData = require('../../models/analyzeLog');

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
  try {
    const rawResult = await Data.find()
      .sort('-date')
      .limit(1);

    const result = { interestRank: rawResult.interestRank };
    res.json(result);
  } catch (e) {
    next(e);
  }
});

//analyze

router.get('/analyze', (req, res, next) => {
  try {
    analyzer(); //주기적으로 analyze 를 돌려줘야됨

    res.send(true);
  } catch (e) {
    next(e);
  }
});

router.get('/:id/analyze', (req, res, next) => {
  try {
    const userid = req.params.id;
    if (!userid) throwError('분석할 아이디가 주어지지 않았습니다.', 400);
    let sendInfo;
    if (analyzer(userid)) {
      sendInfo = userid + ' has been successfully analyzed.';
    } else {
      throwError('데이터 애널라이징에 실패했습니다', 500);
    }
    res.send(sendInfo);
  } catch (e) {
    next(e);
  }
});

router.get('/clear', async (req, res, next) => {
  let result;
  const startTime = timeNow - 2592000000; //one month

  if (process.env.DATA_REMOVE_ACCESSIBLE) {
    result = await analyzeData
      .find()
      .where('date')
      .lte(startTime)
      .remove()
      .exec();
    res.status(200).send('데이터가 제거되었습니다.');
  } else {
    res.status(403).send('데이터 제거가 허가되지 않았습니다.');
  }
});

module.exports = router;
