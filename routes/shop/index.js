// /shop/index.js

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const throwError = require('../../lib/throwError');
const auth = require('../../lib/middlewares/auth');

const Product = require('../../models/product');
const AnalyzeLog = require('../../models/analyzeLog');

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

    if (royalty !== 'afterContact' && !royaltyPrice) {
      return throwError('가격을 입력해 주세요.', 400);
    }
    if (timeToUse === 'selectTime' && !timeToUseDate) {
      return throwError('일자를 입력해 주세요.', 400);
    }
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

router.get('/', auth.parseAutorized, async (req, res, next) => {
  //get product info on MAINMENU generally
  try {
    const queryLimit = req.query.limit && parseInt(req.query.limit, 10);
    const limit = (queryLimit && queryLimit < 8 && queryLimit) || 8;
    const pagination = (req.query.page && parseInt(req.query.page, 10)) || 1;

    if (pagination < 1) return throwError('1페이지부터 찾아 주세요.', 400);
    //const userData = req.user && (await User.findById(req.user._id));
    let $regex;
    let query;
    if (req.query.search) {
      const bannedChar = new RegExp('[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ ]', 'gi');
      const search = req.query.search.toString().replace(bannedChar, ' ');
      $regex = new RegExp(
        '(' + search.toString().replace(/ /g, '|') + ')',
        'gi'
      );
      query = search
        ? {
            $or: [
              { title: { $regex } },
              { category: { $regex } },
              { tags: { $in: $regex } }
            ]
          }
        : {};
    }

    const productQuery = Product.find(query, [
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
      'images',
      'tags',
      'person',
      'status'
    ])
      .populate('owner', ['nickname'])
      .sort('-createdAt')
      .skip((pagination - 1) * limit)
      .limit(parseInt(limit));

    const product = await productQuery;
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

router.get('/:product', auth.parseAutorized, async (req, res, next) => {
  //get specified product info
  try {
    const productId = req.params.product;

    const product = await Product.findOne({ _id: productId }).populate(
      'owner',
      ['nickname', 'profileImage']
    );
    if (!product) return throwError('존재하지 않는 상품입니다.', 404);

    res.json({ product });
  } catch (e) {
    next(e);
  }
});

router.delete('/:product', auth.parseAutorized, async (req, res, next) => {
  try {
    const productId = req.params.product;

    await Product.findOneAndDelete({ _id: productId });
    res.status(201).send(true);
  } catch (error) {
    next(error);
  }
});

router.put('/:product', auth.parseAutorized, async (req, res, next) => {
  try {
    const productId = req.params.product;
    const status = req.query.status;

    await Product.findOneAndUpdate({ _id: productId }, { $set: { status } });
    res.status(201).send(true);
  } catch (error) {
    next(error);
  }
});

router.post('/:product/invite', auth.authroized, async (req, res, next) => {
  try {
    const user = req.user._id;
    const product = await Product.findById(req.params.product);

    if (!product) {
      return throwError('존재하지 않는 상품입니다.', 404);
    }
    if (product.status !== 'PRE_SHARE')
      return throwError('공유가 진행 중이거나 끝난 상품입니다.', 409);
    if (product.owner === user) {
      return throwError('자신의 상품에는 참여하실 수 없습니다.', 400);
    }
    if (product.person < product.participant.length + 1) {
      return throwError('참여 가능한 인원이 꽉 찼습니다.', 400);
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

router.post('/:product/start', auth.authroized, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.product);

    if (!product) {
      return throwError('제품을 찾을 수 없습니다.', 404);
    }
    if (product.owner.toString() !== req.user._id) {
      return throwError('이 제품의 소유자가 아닙니다.', 403);
    }
    product.status = 'IN_PROGRESS';
    await product.save();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post('/:product/end', auth.authroized, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.product);

    if (!product) {
      return throwError('제품을 찾을 수 없습니다.', 404);
    }
    if (product.owner.toString() !== req.user._id) {
      return throwError('이 제품의 소유자가 아닙니다.', 403);
    }
    await product.remove();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
