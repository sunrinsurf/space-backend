const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user');
const connectDB = require('../connectDB');

const user = {
    uid: 1,
    password: 'password',
    phone: 12345679,
    nickname: '테스트유저',
    address: '서울특별시 용산구 청파동 원효로97길 33-4 선린인터넷고등학교',
    interest: ["직업"]
};
let connected = false;
function formatPhone(phone) {
    const p = phone.toString();
    const [a, b] = [
        p.slice(0, 4),
        p.slice(4, 8),
    ]
    return `010-${a}-${b}`;
}
async function createUserHandler(_userData) {
    let userData = _userData;
    if (!_userData) {
        userData = { ...user };
        user.phone += 1;
        user.uid += 1;

        userData.phone = formatPhone(userData.phone);
        userData.uid = `testtt${userData.uid}`;
        userData.email = `${userData.uid}@test.com`
    }
    if (!connected) {
        await connectDB();
        connected = true;
    }

    return {
        postUser() {
            return request(app)
                .post('/user')
                .send(userData);
        },
        async cleanUp() {
            await User.deleteOne({
                uid: userData.uid
            });
        },
        userData
    };
}

exports.createUser = createUserHandler;
exports.user = user;