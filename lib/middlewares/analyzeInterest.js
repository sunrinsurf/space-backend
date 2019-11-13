/*
이 코드는 근 1달 사이에 가장 많이 상품이 등록된 순서대로 interest db에 저장합니다
*/

const transactionLog = require('../../models/transactionLog');
const data = require('../../models/data');

async function analyzeInterest() {
  const timeNow = Date.now();
  const startTime = timeNow - 2592000000;

  const rawData = await transactionLog
    .find()
    .where('postTime')
    .gte(startTime);

  let result = [];

  rawData.map((curElement, index) => {
    const type = rawData[index].type.toString();

    if (isNaN(result[type]) === true) {
      //데이터 배열 초기화
      result[type] = 0;
    }

    result[type] += 1; //= { [type]: sendValue + 1 };
  });

  let sortedResult;

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
  sortedResult = sortProperties(result);

  let sendArray = [];

  for (key in sortedResult) {
    sendArray[key] = sortedResult[key][0];
  }
  console.log('DATA ANALYZED : ' + sendArray);

  await data.findOneAndUpdate(
    { _id: '5db8e6b6042ec77665f03b5f' },
    {
      $set: { interestRank: sendArray }
    }
  );
  return true;
}

module.exports = analyzeInterest;
