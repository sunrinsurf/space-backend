const User = require('../models/user');
const createUser = require('../lib/test/createUser');

const userData = {
    uid: "test01",
    password: "password",
    phone: "010-1234-5968",
    nickname: "테스트",
    address: "경기도 남양주시",
    interest: ["기타"]
};
function deleteUser(done) {
    User.deleteOne({ uid: userData.uid })
        .then(() => {
            done();
        })
        .catch(err => {
            done(err);
        });
}
describe("/user", function () {
    describe("create", () => {
        it('should create user', (done) => {
            createUser(userData).expect(201).end(done);
        });
        it("should handle exist user", function (done) {
            createUser(userData).expect(422).expect({
                status: 422,
                message: '이미 존재하는 유저입니다.'
            }).end(done);
        });
        after(function (done) {
            deleteUser(done);
        });
    });

});