const MClient = require("mongodb").MongoClient;
const throwError = require("./throwError");

const murl = "mongodb://surf:clangsurf@ec2-52-79-169-52.ap-northeast-2.compute.amazonaws.com:27017/";

getDate = () => {
  const currentdate = new Date();
  const datetime = `${currentdate.getFullYear()
     }/${
     currentdate.getMonth() + 1
     }/${
     currentdate.getDate()
     } - ${
     currentdate.getHours()
     }:${
     currentdate.getMinutes()
     }:${
     currentdate.getSeconds()}`;
  return datetime;
};

function sendLog(type, message) {
  const logData = { type, log: message, time: getDate() };
  MClient.connect(murl, (err, db) => {
    if (err) throwError("Error occuerd while connecting db", 502, { logError: true });
    else {
      const dbo = db.db("sunrinsurf");
      dbo.collection("syslog").insertOne(logData, (err2, res) => {
        if (err2) {
 throwError(
            "Error occuered  whiel inserting logData to database",
            500,
          );
}
      });
      db.close();
    }
  });
}

module.exports = sendLog;
