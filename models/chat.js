const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'product',
    unique: true,
    require: true
  },
  createdAt: {
    type: Date,
    set: Date.now
  }
});

module.exports = mongoose.model('chat', chatSchema);
