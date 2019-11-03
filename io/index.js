const socketio = require('socket.io');
const Chat = require('../models/chat');
const connect_to = require('./connect_to');
const room = require('./room');

module.exports = function(server) {
  const io = socketio(server);

  Chat.find().then(data => {
    for (const chat of data) {
      const nsp = io.of(`/${chat.product}`);

      nsp.on('connection', socket => {
        socket.on('connect_to', connect_to(socket, chat.product));
        socket.on('disconnect', () => {
          room.removeUser(chat.product, socket.id);
          socket.broadcast.emit('room_data', room.getData(chat.product));
        });
      });
    }
  });
};
