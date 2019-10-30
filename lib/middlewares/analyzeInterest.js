const transactionLog = require('../../models/transactionLog');

function analyzeInterest() {
  const datas = transactionLog.find();
  return datas;
}

module.exports = analyzeInterest;
