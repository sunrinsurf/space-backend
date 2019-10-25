const request = require('supertest');
const app = require('../app');

describe('SMS', function () {
    describe('Send Message and get token', () => {
        it('should get token', (done) => {
            request(app)
                .post('/user/sms')
                .send({
                    phone: "010-1234-5678"
                })
                .end(done);
        });
        it('throws 400', (done) => {
            request(app)
                .post('/user/sms')
                .expect(400)
                .end(done);
        })
    });
    describe('Verify Code', () => {
        let token;
        const phone = "010-1234-5678"
        const code = "123456"
        before((done) => {
            request(app)
                .post('/user/sms')
                .query({ code })
                .send({
                    phone
                })
                .end((err, data) => {
                    if (err) return done(err);
                    token = data.body.token;
                    done();
                });
        })

        it('should verify code', (done) => {
            request(app)
                .put('/user/sms/' + code)
                .send({
                    phone,
                    token
                })
                .expect(200)
                .end(done);
        })

        describe('Timeout handling', () => {
            let token;
            before((done) => {
                request(app)
                    .post('/user/sms')
                    .query({ code, time: Date.now() - 1000 * 60 * 5 })
                    .send({
                        phone
                    })
                    .end((err, data) => {
                        if (err) return done(err);
                        token = data.body.token;
                        done();
                    });
            })
            it('should handle timeout', (done) => {
                request(app)
                    .put('/user/sms/' + code)
                    .send({
                        token,
                        phone
                    })
                    .expect(403)
                    .expect({
                        message: '3분이 지난 코드입니다.',
                        status: 403
                    })
                    .end(done);
            })
        })
    });
})