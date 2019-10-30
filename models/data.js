const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
  interestRank: [String]
});

module.exports = mongoose.model('data', dataSchema);
