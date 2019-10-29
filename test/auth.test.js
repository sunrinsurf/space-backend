const { createUser } = require('../lib/test/userHandle');
const request = require('../lib/test/testRequest');
const chai = require('chai');
const { expect } = chai;


describe('Auth', () => {
    let user;
    before(function (done) {
        createUser().then(d => {
            user = d;
            user.postUser().end((err, res) => {
                if (err) done(res);
                done();
            });
        });

    })
    after(function (done) {
        user.cleanUp().then(() => done()).catch((err) => done(err));
    })
    it('should create token', (done) => {
        console.log(user.userData);
        request
            .post('/auth')
            .send({
                uid: user.userData.uid,
                password: user.userData.password,
                remember: false
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                console.log(res.body);
                expect(res.body).to.have.property('token');
                done();
            })
    })
});