const transactionLog = require('../../models/transactionLog');
const data = require('../../models/user');

function analyzeInterest() {
  const timeNow = Date.now();
  const startTime = timeNow - 2592000000;

  const rawData = transactionLog.find({});

  const resultData = data.find({
    postTime: {
      $gte: startTime
    }
  });
  return resultData;
}

module.exports = analyzeInterest;
