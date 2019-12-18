const mongoose = require('mongoose');
const throwError = require('../lib/throwError');
const Chat = require('./chat');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  contents: {
    type: String,
    required: true
  },
  person: {
    type: Number,
    required: true
  },
  timeToUse: {
    type: String,
    enum: ['afterContact', 'selectTime', 'noLimit'],
    required: true
  },
  timeToUseDate: {
    type: Date,
    default: null
  },
  images: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: 'image',
    required: true
  },
  royalty: {
    type: String,
    enum: ['afterContact', 'monthly', 'weekly'],
    required: true
  },
  royaltyPrice: {
    type: Number
  },
  category: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    required: true
  },
  participant: {
    type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'user' }],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('validate', function(next) {
  const { title, contents, timeToUse, images, royalty, category } = this;

  if (!title || !contents || !timeToUse || !images || !royalty || !category) {
    return throwError('필수 항목이 없습니다.', 400);
  }
  next();
});
productSchema.post('save', function(doc, next) {
  const chat = new Chat({
    product: doc._id
  });
  chat.save(() => {
    next();
  });
});
const product = mongoose.model('product', productSchema);
module.exports = product;
