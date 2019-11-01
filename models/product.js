const mongoose = require('mongoose');
const throwError = require('../lib/throwError');

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
    type: [{ data: { type: Buffer }, type: { type: String } }],
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
  categorys: {
    type: [String],
    required: true
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  }
});

productSchema.pre('validate', function(next) {
  console.log('pre', this);
  const { title, contents, timeToUse, images, royalty, categorys } = this;

  if (!title || !contents || !timeToUse || !images || !royalty || !categorys) {
    return throwError('필수 항목이 없습니다.', 400);
  }
  next();
});
const product = mongoose.model('product', productSchema);
module.exports = product;
