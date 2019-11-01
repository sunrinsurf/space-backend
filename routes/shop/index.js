// /shop/index.js

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const throwError = require('../../lib/throwError');
const auth = require('../../lib/middlewares/auth');

const Product = require('../../models/product');
const Chat = require('../../models/chat');
//const TransLog = require('../../models/transactionLog');

router.use(bodyParser.json({ extended: true }));

router.post('/', auth.authroized, async (req, res, next) => {
  //save product info to db
  try {
    const {
      title,
      contents,
      person,
      timeToUse,
      timeToUseDate,
      images,
      royalty,
      category,
      royaltyPrice
    } = req.body;
    const ownerId = req.user._id;

    const product = new Product({
      owner: ownerId,
      title,
      contents,
      person,
      timeToUse,
      timeToUseDate,
      images,
      royalty,
      category,
      royaltyPrice
    });
    await product.save();
    res.json({
      success: true,
      productId: product._id
    });
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  //get product info on MAINMENU generally
  try {
    const limit = req.query.limit || 10;

    const product = await Product.find({}, [
      'owner',
      'title',
      '_id',
      'createdAt',
      'category',
      'timeToUse',
      'timeToUseDate',
      'royalty',
      'royaltyPrice',
      'images',
      'participant'
    ])
      .populate('owner', ['nickname'])
      .sort('-createdAt')
      .limit(parseInt(limit)); //interest 안에 있는 데이터 중 가장 최근순으로 dataCount 만큼의 데이터를 갖고옴 *테스트 아직 안함!
    if (!product)
      return throwError('조건에 일치하는 제품 데이터가 없습니다.', 404);
    const result = product
      .map(d => d.toObject())
      .map(d => ({
        ...d,
        images: d.images.map(img => img.data.toString('base64'))
      }));
    res.json({
      product: result
    });
  } catch (e) {
    next(e);
  }
});

router.get('/:post', async (req, res, next) => {
  //get specified product info
  try {
    const productId = req.params.post;
    let result;
    try {
      result = await Product.findOne({ _id: productId });
    } catch (e) {
      res.send(false);
    }

    // if (!result) return throwError('게시글이 존재하지 않습니다.', 404);

    res.json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
