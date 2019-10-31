const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  title: String,
  postid: String,
  type: String,
  owner: String,
  postTime: Date
});
module.exports = mongoose.model('transactionlog', logSchema);
