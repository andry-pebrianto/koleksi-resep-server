const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");
const photoLimit = require("../middlewares/photoLimit");
const { uploadToAws } = require("../controllers/upload.controller");

const router = express.Router();

router
  // semua role
  .post(
    "/upload/aws",
    jwtAuth,
    upload,
    photoLimit,
    uploadToAws
  );

module.exports = router;
