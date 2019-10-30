const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  title: String,
  postid: String,
  type: String,
  owner: String,
  postTime: Date
});
module.exports = mongoose.model('transactionLog', productSchema);
