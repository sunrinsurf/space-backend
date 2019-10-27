const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL
    || 'mongodb://52.79.169.52/sunrinsurf';
const env = process.env.NODE_ENV || 'development';

const auth = require('../db.json');

let mongoURL = MONGO_URL;
if (env !== 'production') mongoURL += `_${env}`;

module.exports = () => (
  mongoose.connect(mongoURL, {
    ...auth,
    auth: { authdb: 'admin' },
  })
);
