const express = require('express');
const validation = require('../validations/auth.validation');
const runValidation = require('../middlewares/runValidation');
const { isVerified } = require('../middlewares/authorization');
const upload = require('../middlewares/upload');
const photoLimit = require('../middlewares/photoLimit');
const {
  register,
  login,
  activation,
} = require('../controllers/auth.controller');

const router = express.Router();

router
  .post('/auth/register', upload, photoLimit, validation.register, runValidation, register)
  .post('/auth/login', isVerified, validation.login, runValidation, login)
  .get('/auth/activation/:token', activation);

module.exports = router;
