const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  subject: String,
  member: [String],
  content: [
    {
      user: String,
      text: String,
      time: Number
    }
  ]
});

module.exports = mongoose.model('chat', chatSchema);
