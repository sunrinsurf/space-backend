const mongoose = require('mongoose');

let mongoURL = process.env.MONGO_URI || 'mongodb://localhost/sunrinsurf';
const env = process.env.NODE_ENV || 'development';

if (env !== 'production') mongoURL += `_${env}`;
if (env === 'development') {
  mongoose.set('debug', true);
}

let config = {};
console.log(process.env.MONGO_URL);
if (process.env.MONGO_ID || process.env.MONGO_PW) {
  config = {
    user: process.env.MONGO_ID,
    pass: process.env.MONGO_PW,
    auth: { authdb: 'admin' }
  };
}
module.exports = () => mongoose.connect(mongoURL, config);
