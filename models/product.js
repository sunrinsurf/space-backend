const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  title: String,
  type: String,
  content: String,
  condition: String,
  owner: String,
  image: String,
  postTime: Number
});

module.exports = mongoose.model('product', productSchema);
