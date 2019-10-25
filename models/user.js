const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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

module.exports = mongoose.model('user', userSchema);