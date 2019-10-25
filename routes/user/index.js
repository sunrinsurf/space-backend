// /user/index.js

const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var MClient = require("mongodb").MongoClient;

const throwError = require("../../lib/throwError");
const sendLog = require("../../lib/sendLog");
const phoneCert = require("../../lib/PhoneCertToken");

var murl =
  "mongodb://surf:clangsurf@ec2-52-79-169-52.ap-northeast-2.compute.amazonaws.com:27017/";

var userInfoSchema = mongoose.Schema({
  //Register Dataset's SCHEMA
  uid: "string",
  password: "string",
  enckey: "string",
  nickname: "string",
  email: "string",
  phone: "string",
  address: "string",
  interest: "array",
  regdate: "string",
  shareitem: "array",
  transhistory: "array",
  something: "string"
});

require("dotenv").config();

router.use(bodyParser.json());

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

router.post("/", (req, res) => {
  //register
  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(
      req.body.password,
      buf.toString("base64"),
      100000,
      64,
      "sha512",
      (err, key) => {
        if (!err) {
          //encrypting success
          const Ukey = buf.toString("base64");
          const Upw = key.toString("base64");
          crypto.pbkdf2(
            // 가끔가다가 crypto에서 잘못된 값을 전달해주는 경우가 있어 확인절차
            req.body.password,
            Ukey,
            100000,
            64,
            "sha512",
            (err, testKey) => {
              if (Upw === testKey.toString("base64")) {
                var userInfoSchemaModel = mongoose.model(
                  //making a schema-model
                  "schema",
                  userInfoSchema
                );
                var somethingStr = "NULL";
                try {
                  somethingStr = req.body.something;
                } catch (e) {}
                var userInfo = new userInfoSchemaModel({
                  //making an object for insertion
                  uid: req.body.uid,
                  password: Upw,
                  enckey: Ukey,
                  nickname: req.body.nickname,
                  email: req.body.email,
                  phone: req.body.phone,
                  address: req.body.address,
                  interest: req.body.interest,
                  regdate: getDate(),
                  shareitem: [],
                  transhistory: [],
                  something: somethingStr
                });

                var returnValue = false;

                MClient.connect(murl, function(err, db) {
                  if (err)
                    //database connection failure
                    throwError("Error occured while connecting database", 502, {
                      logError: true
                    });
                  else if (
                    !phoneCert.verifyToken(req.body.ptoken, req.body.phone)
                  ) {
                    throwError("Phone token does not match", 403);
                    sendLog("TOKERROR", "Phone token does not match");
                  } else {
                    //proceed to the insertion
                    var successBool = true;
                    var dbo = db.db("sunrinsurf");
                    dbo
                      .collection("userdata")
                      .insertOne(userInfo, function(err, res) {
                        if (err) {
                          //database insertion failure
                          successBool = false;
                          throwError(
                            "Error occured while inserting Register_data to database",
                            500,
                            { logError: true }
                          );
                        }
                      });
                    returnValue = true;
                    sendLog("REGISTER", "ID = " + req.body.uid);
                    res.send("INSERTION SUCCESS : " + successBool);
                    db.close();
                  }
                });
              } else {
                throwError(
                  "Error while register : Password Key initial comparation failed!",
                  500,
                  { logError: true }
                );
              }
            }
          );
        } else {
          // data encryption failure
          throwError("Error while Register : cannot encrypt data", 500);
        }
      }
    );
  });
});

router.post("/overlap", (req, res) => {
  setTimeout(function() {
    var returnValue;
    var query;
    MClient.connect(murl, function(err, db) {
      if (err) {
        throwError("Failed to connect db", 502, { throwError: true });
      } else {
        //Find 겹침
      }
      switch (req.body.type) {
        case "id":
          query = { uid: req.body.content };
          break;
        case "phone":
          query = { phone: req.body.content };
          break;
        case "email":
          query = { email: req.body.content };
          break;
        default:
          throwError("Cannot get type of data", 500, { logError: true });
      }
      var dbo = db.db("sunrinsurf");
      dbo
        .collection("userdata")
        .find(query)
        .toArray(function(errD, result) {
          if (errD) throwError("Failed to connect db", 502, { logError: true });
          else {
            try {
              result[0].uid;
              returnValue = { overlap: true };
              // if (result[0].uid == undefined) {
              //   returnValue = { overlap: false };
              // } else {
              //   returnValue = { overlap: true };
              // }
            } catch (e) {
              returnValue = { overlap: false };
            }
            sendLog(
              "INQUIRE",
              "TYPE : " +
                req.body.type +
                " | CONTENT : " +
                req.body.content +
                " | OVERLAP : " +
                returnValue.overlap
            );
            res.send(returnValue);
          }
        });
    });
  }, 1000);
});

router.get("/:id", (req, res) => {});

module.exports = router;
