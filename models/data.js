const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
  interestRank: Array
});

module.exports = mongoose.model('data', dataSchema);
