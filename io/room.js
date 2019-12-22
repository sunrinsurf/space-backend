const User = require('./User');

const users = {};

exports.users = users;
exports.addUser = (socket, chatId, userId, userNickname, userProfileImage) => {
  const user = new User(socket, chatId, userId, userNickname, userProfileImage);
  users[socket.id] = user;
};
