const mongoose = require('mongoose');
const Schema = mongoose.Schema();

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
