const request = require('supertest');
const app = require('../../app');

module.exports = request(app);