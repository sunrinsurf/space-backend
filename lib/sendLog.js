var MClient = require("mongodb").MongoClient;
const throwError = require("./throwError");

var murl =
  "mongodb://surf:clangsurf@ec2-52-79-169-52.ap-northeast-2.compute.amazonaws.com:27017/";

getDate = () => {
  var currentdate = new Date();
  const datetime =
    currentdate.getFullYear() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getDate() +
    " - " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  return datetime;
};

function sendLog(type, message) {
  var logData = { type: type, log: message, time: getDate() };
  MClient.connect(murl, function(err, db) {
    if (err)
      throwError("Error occuerd while connecting db", 502, { logError: true });
    else {
      var dbo = db.db("sunrinsurf");
      dbo.collection("syslog").insertOne(logData, function(err2, res) {
        if (err2)
          throwError(
            "Error occuered  whiel inserting logData to database",
            500
          );
      });
      db.close();
    }
  });
}

module.exports = sendLog;
