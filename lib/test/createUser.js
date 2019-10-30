const request = require('supertest');
const app = require('../../app');

module.exports = function createUser(userData) {
    return request(app)
        .post('/user')
        .send(userData)
}