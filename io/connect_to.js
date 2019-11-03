const verifyToken = require('../lib/verifyToken');
const room = require('./room');
const User = require('../models/user');

module.exports = (socket, product) => {
  return token => {
    let user;
    try {
      user = verifyToken(token);
    } catch (e) {
      return socket.emit('error', '인증에 실패했습니다.');
    }
    User.findById(user._id, ['nickname']).then(user => {
      room.addUser(product, socket.id, user._id, user.nickname);
      const data = room.getData(product);

      socket.emit('room_data', data);
      socket.broadcast.emit('room_data', data);
    });
  };
};
