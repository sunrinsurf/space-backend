const socketio = require('socket.io');
const verifyToken = require('../lib/verifyToken');

const connectToRoom = require('./connectToRoom');

module.exports = function (server) {
    const io = socketio(server, {
        path: '/chat',
    });

    io.on('connection', (socket) => {
        socket.rooms
        socket.on('connect_to', connectToRoom)
    });
}