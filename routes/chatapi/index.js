// /chat/index.js

const express = require('express');
const router = express.Router();
const Chat = require('../../models/chat');
const User = require('../../models/user');
const throwError = require('../../lib/throwError');
const auth = require('../../lib/middlewares/auth');
router.post('/:id/join', auth.authroized, async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ product: req.params.id }).populate(
      'product',
      ['title', 'contents', 'participant', 'owner']
    );
    if (!chat) {
      return throwError('존재하지 않는 채팅입니다.', 404);
    }

    const chatData = chat.toJSON();
    chatData.product.owner = await User.findById(chatData.product.owner, [
      'nickname'
    ]);
    for (const i in chatData.product.participant) {
      const user = await User.findById(chatData.product.participant[i], [
        'nickname'
      ]);
      if (!user) {
        chatData.product.participant[i] = null;
      } else {
        chatData.product.participant[i] = user;
      }
    }
    res.json({ chat: chatData });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
