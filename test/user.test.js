const { createUser } = require('../lib/test/userHandle');

function deleteUser(done) {
    cleanUp()
        .then(() => {
            done();
        })
        .catch(err => {
            done(err);
        });
}
describe("/user", function () {
    let user;
    before(function (done) {
        createUser().then(data => {
            user = data;
            done();
        });
    })
    describe("create", () => {
        it('should create user', (done) => {
            user.postUser().expect(201).end(done);
        });
        it("should handle exist user", function (done) {
            user.postUser().expect(422).expect({
                status: 422,
                message: '이미 존재하는 유저입니다.'
            }).end(done);
        });
        after(function (done) {
            user.cleanUp().then(() => done()).catch(done);
        });
    });

});