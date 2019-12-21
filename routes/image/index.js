const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const auth = require('../../lib/middlewares/auth');
const throwError = require('../../lib/throwError');
const Image = require('../../models/image');
const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype.match(/^image\//)) {
      return cb(null, false);
    }
    cb(null, true);
  },
  preservePath: ''
});

router.post('/', auth.parseAutorized, upload.any(), (req, res, next) => {
  if (!req.files.length) {
    return throwError('파일이 업로드되지 않았습니다. 요청을 확인하세요.', 400);
  }
  Promise.all(
    req.files.map(data =>
      (async () => {
        const thumbnail = await sharp(data.buffer)
          .resize(450)
          .jpeg({
            quality: 80
          })
          .toBuffer();
        const image = data.buffer;
        const type = data.mimetype;

        const img = new Image({
          image,
          thumbnail,
          type,
          by: req.user ? req.user._id : null
        });

        await img.save();
        return img._id;
      })()
    )
  )
    .then(data => {
      res.json(data);
    })
    .catch(e => {
      next(e);
    });
});

async function getImage(id) {
  const image = await Image.findById(id);
  if (!image) {
    return throwError('이미지를 찾을 수 없습니다.', 404);
  }
  return image;
}
router.get('/:id', (req, res, next) => {
  getImage(req.params.id)
    .then(image => {
      res.type(image.type);
      res.send(image.image);
    })
    .catch(e => {
      next(e);
    });
});

router.get('/:id/thumbnail', (req, res, next) => {
  getImage(req.params.id)
    .then(image => {
      res.type(image.type);
      res.send(image.thumbnail);
    })
    .catch(e => {
      next(e);
    });
});

module.exports = router;
