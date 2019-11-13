const mongoose = require('mongoose');
const Schema = mongoose.Schema();
const Model = mongoose.model();

const analyzeSchema = Schema({
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

module.exports = Model('analyzelog', analyzeSchema);
