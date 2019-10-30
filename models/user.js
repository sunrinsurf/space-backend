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
    required: true
  }
});

module.exports = mongoose.model('user', userSchema);
