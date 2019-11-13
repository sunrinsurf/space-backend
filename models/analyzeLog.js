const mongoose = require('mongoose');

const analyzeSchema = mongoose.Schema({
  user: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    require: true
  },
  category: {
    type: String,
    require: true
  },
  accessType: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('analyzelog', analyzeSchema);
