const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  categorys: {
    type: [String],
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
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  image: [
    {
      data: {
        type: Buffer
      },
      type: {
        type: String
      }
    }
  ],
  isEnded: {
    type: Boolean,
    required: true
  },
  participant: {
    type: [mongoose.SchemaTypes.ObjectId],
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

module.exports = mongoose.model('product', productSchema);
