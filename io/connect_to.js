const verifyToken = require('../lib/verifyToken');
const room = require('./room');
const User = require('../models/user');
const Chat = require('../models/chat');

module.exports = socket => {
  return (token, chatId) => {
    let userdata;
    try {
      userdata = verifyToken(token);
    } catch (e) {
      return socket.emit('error', '인증에 실패했습니다.');
    }
    (async () => {
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return socket.emit('error', '없는 채팅방입니다.');
      }
      const user = await User.findById(userdata._id, [
        'nickname',
        'profileImage'
      ]);
      room.addUser(
        socket,
        chat._id,
        user._id,
        user.nickname,
        user.profileImage
      );
    })().catch(e => {
      throw e;
    });
  };
};
