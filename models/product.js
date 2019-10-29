const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    required: true
  },
  image: {
    type: [{ data: Buffer, type: String }],
    required: true
  },
});

module.exports = mongoose.model('product', productSchema);
