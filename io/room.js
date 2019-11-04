const User = require('./User');

const users = {};

exports.users = users;
exports.addUser = (socket, chatId, userId, userNickname) => {
  console.log(socket.id);
  const user = new User(socket, chatId, userId, userNickname);
  users[socket.id] = user;
};
