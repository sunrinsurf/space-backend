// /shop/index.js

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const throwError = require('../../lib/throwError');
const auth = require('../../lib/middlewares/auth');

const Product = require('../../models/product');
const AnalyzeLog = require('../../models/analyzeLog');
const User = require('../../models/user');
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
      royaltyPrice,
      tags
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
      participant: [],
      royaltyPrice,
      tags
    });
    await product.save();

    const analyzeRawData = new AnalyzeLog({
      user: ownerId,
      date: Date.now(),
      category: category,
      accessType: 'arrange'
    });

    await analyzeRawData.save();

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
    let product;

    const userData = await User.findOne({ _id: req.query._id });
    if (userData) {
      //유저정보가 있을때
      product = await Product.find({}, [
        'owner',
        'title',
        '_id',
        'createdAt',
        'category',
        'timeToUse',
        'timeToUseDate',
        'royalty',
        'royaltyPrice',
        'participant',
        'images'
      ])
        .in('category', userData.interest)
        .populate('owner', ['nickname'])
        .sort('-createdAt')
        .limit(parseInt(limit)); //interest 안에 있는 데이터 중 가장 최근순으로 dataCount 만큼의 데이터를 갖고옴
    } else {
      //유저 정보가 없을때
      product = await Product.find({}, [
        'owner',
        'title',
        '_id',
        'createdAt',
        'category',
        'timeToUse',
        'timeToUseDate',
        'royalty',
        'royaltyPrice',
        'participant',
        'images'
      ])
        .populate('owner', ['nickname'])
        .sort('-createdAt')
        .limit(parseInt(limit)); //interest 안에 있는 데이터 중 가장 최근순으로 dataCount 만큼의 데이터를 갖고옴
    }
    if (!product)
      return throwError('조건에 일치하는 제품 데이터가 없습니다.', 404);

    product.forEach(async data => {
      const analyzeRawData = new AnalyzeLog({
        user: req.user.id || 'NOT_DEFINED',
        date: Date.now(),
        category: data.category || 'NOT_DEFINED',
        accessType: 'view'
      });

      await analyzeRawData.save();
    });
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
    const userId = req.query._id;

    const product = await Product.findOne({ _id: productId }).populate(
      'owner',
      ['nickname']
    );
    if (!product) return throwError('존재하지 않는 상품입니다.', 404);

    const analyzeRawData = new AnalyzeLog({
      user: userId || 'NOT_DEFINED',
      date: Date.now(),
      category: product.category || 'NOT_DEFINED',
      accessType: 'view'
    });

    analyzeRawData.save();

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
      if (user.toString() === p.toString())
        return throwError('이미 참여 중인 상품입니다.', 422);
    }

    product.participant.push(user);
    await product.save();

    const analyzeRawData = new AnalyzeLog({
      user: user || 'NOT_DEFINED',
      date: Date.now(),
      category: product.category || 'NOT_DEFINED',
      accessType: 'purchase'
    });

    analyzeRawData.save();

    res.json({
      success: true
    });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
