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

    console.log(images);
    const product = new Product({
      owner: ownerId,
      title,
      contents,
      person,
      timeToUse,
      timeToUseDate,
      images: images.map(img => ({
        ...img,
        data: Buffer.from(img.data, 'base64')
      })),
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
      'participant'
    ])
      .populate('owner', ['nickname'])
      .sort('-createdAt')
      .limit(parseInt(limit)); //interest 안에 있는 데이터 중 가장 최근순으로 dataCount 만큼의 데이터를 갖고옴 *테스트 아직 안함!
    if (!product)
      return throwError('조건에 일치하는 제품 데이터가 없습니다.', 404);
    res.json({
      product
    });
  } catch (e) {
    next(e);
  }
});
router.get('/:product/images/:idx', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.product);
    if (!product) {
      return throwError('상품이 없습니다.', 404);
    }
    const idx = parseInt(req.params.idx, 10);
    if (product.images.length <= idx) {
      return throwError('이미지가 없습니다.', 404);
    }

    const image = product.images[idx];
    res.type(image.type);
    res.send(image.data);
  } catch (e) {
    next(e);
  }
});
router.get('/:product', async (req, res, next) => {
  //get specified product info
  try {
    const productId = req.params.product;
    const product = await Product.findOne({ _id: productId }).populate(
      'owner',
      ['nickname']
    );
    if (!product) {
      return throwError('존재하지 않는 상품입니다.', 404);
    }
    res.json({ product });
  } catch (e) {
    next(e);
  }
});
router.post('/:product/invite', auth.authroized, async (req, res, next) => {
  try {
    const user = req.user._id;
    const product = await Product.findById(req.params.product);

    if (!product) {
      return throwError('존재하지 않는 상품입니다.', 404);
    }
    if (product.owner === user) {
      return throwError('자신의 상품에는 참여하실 수 없습니다.', 400);
    }

    for (const p of product.participant) {
      console.log(user, p);
      if (user.toString() === p.toString())
        return throwError('이미 참여 중인 상품입니다.', 422);
    }

    product.participant.push(user);
    await product.save();

    res.json({
      success: true
    });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
