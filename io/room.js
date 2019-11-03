const room = {};
const usernames = {};

exports.addUser = (product, id, userId, username) => {
  if (!room[product]) {
    room[product] = {};
  }
  room[product][id] = userId;
  usernames[id] = username;
};
exports.getData = product => {
  if (!room[product]) {
    room[product] = {};
  }

  const data = {};
  for (const p of Object.values(room[product])) {
    data[p] = true;
  }

  return data;
};
exports.getUsername = id => {
  return usernames[id];
};
exports.removeUser = (product, socketId) => {
  if (!room[product]) {
    room[product] = {};
  }
  delete room[product][socketId];
  delete usernames[socketId];
};
