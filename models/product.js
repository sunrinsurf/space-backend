const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
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
    type: String,
    required: true
  },
  image: {
    data: {
      type: Buffer,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  isEnded: {
    type: Boolean,
    required: true
  },
  participant: {
    type: [String],
    required: true
  },
  royaltyMethod: {
    type: String,
    required: true
  },
  availableDate: {
    type: [Date],
    required: true
  },
  shareCount: {
    type: Number,
    required: true
  },
  shareDuration: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('transactionLog', productSchema);
