let room = {};

exports.addUser = (product, id, userId) => {
  if (!room[product]) {
    room[product] = {};
  }
  room[product][id] = userId;
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
exports.removeUser = (product, socketId) => {
  if (!room[product]) {
    room[product] = {};
  }
  delete room[product][socketId];
};
