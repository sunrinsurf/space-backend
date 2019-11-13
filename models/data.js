const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
  interestRank: { type: Array, require: true },
  date: { type: Date, require: true }
});

module.exports = mongoose.model('data', dataSchema);
