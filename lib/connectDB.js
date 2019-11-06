const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://52.79.169.52/sunrinsurf';
const env = process.env.NODE_ENV || 'development';

let mongoURL = MONGO_URL;
if (env !== 'production') mongoURL += `_${env}`;
if (env === 'development') {
  mongoose.set('debug', true);
}

module.exports = () =>
  mongoose.connect(mongoURL, {
    user: process.env.MONGO_ID,
    pass: process.env.MONGO_PW,
    auth: { authdb: 'admin' }
  });
