const analyzeData = require('../../models/analyzeLog');
const data = require('../../models/data');
const throwError = require('../throwError');

async function analyzeInterest(uid) {
  const timeNow = Date.now();
  const startTime = timeNow - 2592000000; //one month

  let rawData;

  if (user) {
    rawData = await analyzeData
      .find({ user: uid })
      .where('date')
      .gte(startTime);
  } else {
    rawData = await analyzeData
      .find()
      .where('date')
      .gte(startTime);
  }

  if (!rawData) throwError('분석할 데이터가 부족하거나 없습니다.', 404);

  let result = [];

  rawData.map((curElement, index) => {
    const type = rawData[index].category.toString();

    if (isNaN(result[type]) === true) {
      //데이터 배열 초기화
      result[type] = 0;
    }

    switch (rawData[index].accessType.toString()) {
      case 'arrange':
        result[type] += 6;
        break;
      case 'view':
        result[type] += 1;
        break;
      case 'participate':
        result[type] += 4;
        break;
    }
  });

  function sortProperties(obj) {
    // convert object into array
    var sortable = [];
    for (var key in obj) sortable.push([key, obj[key]]); // each item is an array in format [key, value]

    // sort items by value
    sortable.sort(function(a, b) {
      return b[1] - a[1]; // compare numbers
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
  }
  const sortedResult = sortProperties(result);

  let sendArray = [];

  for (key in sortedResult) {
    sendArray[key] = sortedResult[key][0];
  }

  if (uid) {
    console.log('PERSONAL DATA ANALYZED : ', sendArray);

    await User.findOneAndUpdate({ uid: uid }, { interest: sendArray });
    return true;
  } else {
    console.log('DATA ANALYZED : ' + sendArray);

    // process.env.ANALYZE_ISENABLED = 'a';
    await data.save({
      $set: { interestRank: sendArray }
    });
    return true;
  }
}

module.exports = analyzeInterest;
