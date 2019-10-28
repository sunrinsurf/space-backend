const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  // Register Dataset's SCHEMA
  uid: String,
  password: String,
  enckey: String,
  nickname: String,
  email: String,
  phone: String,
  address: String,
  interest: [String]
});

module.exports = mongoose.model('user', userSchema);
