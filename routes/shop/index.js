// /shop/index.js

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const util = require('util');
const throwError = require('../../lib/throwError');

const Product = require('../../models/product');
const Chat = require('../../models/chat');
//const token = require("../../lib/middlewares/auth");

router.use(bodyParser.json({ extended: true }));

router.post('/', async (req, res, next) => {
  //save product info to db
  try {
    const { title, type, content, condition, owner, image } = req.body;

    const product = new Product({
      title,
      type,
      content,
      condition,
      owner,
      image
    });

    try {
      await product.save();
    } catch (e) {
      console.error(e);
      return throwError('데이터 저장에 실패했습니다.', 500);
    }
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  //get product info on MAINMENU generally
  try {
    // const interest = req.params.interest;

    // const productData = Product.findOne;

    // const senderQuery = {};
    // const senderproduct = Product.findOne;

    const dataCount = req.query.count;
    const interest = req.query.interest;

    const product = Product.find({ interest: { $in: interest } })
      .sort('-postTime')
      .limit(dataCount); //interest 안에 있는 데이터 중 가장 최근순으로 dataCount 만큼의 데이터를 갖고옴
    if (!product) return throwError('조건에 일치하는 데이터가 없습니다.', 404);
    const result = {
      product: product,
      chatInfo: 'NOT_READY'
    };
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get('/:productId', async (req, res, next) => {
  //get specified product info
  try {
    const productId = req.params.productId;
    const result = await Product.findById(productId);

    if (!result) return throwError('게시글이 존재하지 않습니다.', 400);

    res.json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
