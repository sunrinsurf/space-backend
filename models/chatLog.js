const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  by: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'user'
  },
  chat: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'chat'
  }
});

const chatLog = mongoose.model('chatLog', chatLogSchema);

module.exports = chatLog;
