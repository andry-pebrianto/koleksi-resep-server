const express = require('express');
const upload = require('../middlewares/upload');
const {
  register,
  login,
} = require('../controllers/auth.controller');

const router = express.Router();

router
  .post('/auth/register', upload, register)
  .post('/auth/login', login);

module.exports = router;
