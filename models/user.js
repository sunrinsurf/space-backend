const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Register Dataset's SCHEMA
  uid: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  enckey: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  interest: {
    type: [String],
    default: []
  },
  lastLogin: {
    type: Date,
    default: 0
  },
  staticInterest: {
    type: [String],
    required: true,
    default: []
  },
  regdate: {
    type: Date,
    default: Date.now
  },
  profileImage: {
    type: String
  }
});

module.exports = mongoose.model('user', userSchema);
