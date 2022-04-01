const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

// management file
const multerUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/photo');
    },
    filename: (req, file, cb) => {
      const name = crypto.randomBytes(30).toString('hex');
      const ext = path.extname(file.originalname);
      const filename = `${name}${ext}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext === '.jpg' || ext === '.png') {
      cb(null, true);
    } else {
      cb({ message: 'Photo extension only can .jpg or .png' }, false);
    }
  },
  limits: { fileSize: 2000000 },
});

// middleware
module.exports = (req, res, next) => {
  const multerSingle = multerUpload.single('photo');
  multerSingle(req, res, (err) => {
    if (err) {
      req.APP_DATA = {
        photoError: {
          msg: err.message,
          param: 'photo',
          location: 'body',
        },
      };
      next();
    } else {
      next();
    }
  });
};
