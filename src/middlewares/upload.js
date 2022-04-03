const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

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
    if (file.fieldname === "photo") {
      param = "photo";

      // filter mimetype
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb({ message: "Photo extension only can .jpg or .png" }, false);
      }
    } else {
      param = "video";

      // filter mimetype
      if (file.mimetype === "video/mp4" || file.mimetype === "video/3gpp") {
        cb(null, true);
      } else {
        cb({ message: "Video extension only can .mp4 or .3gp" }, false);
      }
    }
  },
  limits: { fileSize: 2000000 },
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
