const AnalyzeData = require('../../models/analyzeLog');
const User = require('../../models/user');

async function analyzePersonalInterestData(uid) {
  const startTime = Date.now() - 2592000000; //a Month before

  const rawData = await AnalyzeData.find({ user: uid })
    .where('date')
    .gte(startTime);

  let result = [];

  rawData.map((curElement, index) => {
    const type = rawData[index].category.toString();

    if (isNaN(result[type]) == true) {
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
  console.log('PERSONAL DATA ANALYZED : ', sendArray);

  await User.findOneAndUpdate({ uid: uid }, { interest: sendArray });
  return true;
}

module.exports = analyzePersonalInterestData;
