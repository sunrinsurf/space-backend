const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({});

module.exports = mongoose.model('chat', chatSchema);
