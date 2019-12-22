const room = require('./room');
const ChatLog = require('../models/chatLog');

class User {
  /**
   *
   * @param {SocketIO.Socket} socket;
   * @param {string} chatId
   * @param {string} userId
   * @param {string} userNickname
   */
  constructor(socket, chatId, userId, userNickname, profileImage) {
    this.chatId = chatId;
    this.userId = userId;
    this.nickname = userNickname;
    this.socket = socket;
    this.profileImage = profileImage;

    this.socket.join(this.chatId);
    this.socket.on('disconnect', this.disconnect.bind(this));
    this.socket.on('chat', this.chat.bind(this));

    this.init();
  }

  async init() {
    const _chatLogs = await ChatLog.find({
      chat: this.chatId,
      time: {
        $gt: Date.now() - 1000 * 60 * 60 * 24 * 7 // 최근 7일
      }
    })
      .sort('-time')
      .populate('by', ['nickname', 'profileImage'])
      .limit(100);
    const chatLogs = _chatLogs.sort();
    const data = {};
    Object.values(room.users).forEach(v => {
      data[v.userId] = true;
    });
    this.socket.emit('room_data', { room: data, chatLogs });
    this.socket.broadcast.emit('room_data', { room: data });
  }

  disconnect() {
    const data = {};
    Object.values(room.users).forEach(v => {
      if (v.socket.id === this.socket.id) return;
      data[v.userId] = true;
    });
    this.socket.broadcast.emit('room_data', { room: data });

    delete room.users[this.socket.id];
  }
  chat(message) {
    const time = Date.now();
    const chatLog = new ChatLog({
      message,
      by: this.userId,
      chat: this.chatId,
      time
    });
    this.socket.broadcast.emit('chat', {
      message,
      nickname: this.nickname,
      profileImage: this.profileImage,
      time
    });

    chatLog.save();
  }
}

module.exports = User;
