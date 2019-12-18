const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: {
    type: Buffer,
    required: true
  },
  thumbnail: {
    type: Buffer,
    required: true
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  type: {
    type: String,
    default: 'application/octet-stream'
  },
  by: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    required: true
  }
});

const image = mongoose.model('image', imageSchema);

module.exports = image;
