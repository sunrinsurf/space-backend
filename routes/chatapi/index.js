// /chat/index.js

const express = require('express');
const router = express.Router();
const Chat = require('../../models/chat');
const Product = require('../../models/product');
const User = require('../../models/user');
const throwError = require('../../lib/throwError');
const auth = require('../../lib/middlewares/auth');
router.post('/:id/join', auth.authroized, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id, ['_id']);
    if (!product) {
      return throwError('존재하지 않는 채팅입니다.', 404);
    }

    let chat = await Chat.findOne({ product: req.params.id }).populate(
      'product',
      ['title', 'contents', 'participant', 'owner', 'status']
    );
    if (!chat) {
      chat = new Chat({
        product: req.params.id
      });
      await chat.save();
    }
    const chatData = chat.toJSON();
    chatData.product.owner = await User.findById(chatData.product.owner, [
      'nickname',
      'profileImage'
    ]);
    for (const i in chatData.product.participant) {
      const user = await User.findById(chatData.product.participant[i], [
        'nickname',
        'profileImage'
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
