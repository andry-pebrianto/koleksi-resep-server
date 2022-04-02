const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

let fileSize = 0;
let param = "";

// management file
const multerUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "photo") {
        cb(null, "./public/photo");
      } else {
        cb(null, "./public/video");
      }
    },
    filename: (req, file, cb) => {
      const name = crypto.randomBytes(30).toString("hex");
      const ext = path.extname(file.originalname);
      const filename = `${name}${ext}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (file.fieldname === "photo") {
      fileSize = 2000000;
      param = "photo";

      if (ext === ".jpg" || ext === ".png") {
        cb(null, true);
      } else {
        cb(
          { message: "Photo extension only can .jpg or .png", param: "photo" },
          false
        );
      }
    } else {
      fileSize = 20000000;
      param = "video";

      if (ext === ".mp4" || ext === ".3gp") {
        cb(null, true);
      } else {
        cb(
          { message: "Video extension only can .mp4 or .3gp", param: "video" },
          false
        );
      }
    }
  },
  limits: { fileSize },
});

// middleware
module.exports = (req, res, next) => {
  const multerFields = multerUpload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]);
  multerFields(req, res, (err) => {
    if (err) {
      req.APP_DATA = {
        fileError: {
          msg: err.message,
          param,
          location: "body",
        },
      };
      next();
    } else {
      next();
    }
  });
};
