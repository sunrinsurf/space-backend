const socketio = require('socket.io');
const Chat = require('../models/chat');
const connect_to = require('./connect_to');
module.exports = function(server) {
  const io = socketio(server);

  io.on('connection', socket => {
    socket.on('connect_to', connect_to(socket));
  });
};
