const express = require("express");
const jwtAuth = require("../middlewares/jwtAuth");

const { list } = require("../controllers/tag.controller");

const router = express.Router();

router.get("/tag", jwtAuth, list);

module.exports = router;
