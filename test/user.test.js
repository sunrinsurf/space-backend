const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe("/user", function () {
    after(() => User.deleteMany())
    describe("create", () => {
        it('should create user', (done) => {
            request(app)
                .post('/user')
                .send({
                    uid: "test01",
                    password: "password",
                    phone: "010-1234-5968",
                    nickname: "테스트",
                    address: "경기도 남양주시",
                    interest: ["기타"]
                })
                .expect(201)
                .end(done);
        });
    });
});