const express = require('express');
const upload = require('../middlewares/upload');
const {
  register,
  login,
  activation,
} = require('../controllers/auth.controller');

const router = express.Router();

router
  .post('/auth/register', upload, register)
  .post('/auth/login', login)
  .get('/auth/activation/:token', activation);

module.exports = router;
