const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  title: String,
  postid: String,
  categorys: [String],
  owner: String,
  postTime: Date
});
module.exports = mongoose.model('transactionlog', logSchema);
