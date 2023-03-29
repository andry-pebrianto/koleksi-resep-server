const express = require('express');
const validation = require('../validations/auth.validation');
const runValidation = require('../middlewares/runValidation');
const { isVerified } = require('../middlewares/authorization');
const {
  register,
  login,
  activation,
  forgot,
  reset,
} = require('../controllers/auth.controller');

const router = express.Router();

router
  .post('/auth/register', validation.register, runValidation, register)
  .get('/auth/activation/:token', activation)
  .post('/auth/login', isVerified, validation.login, runValidation, login)
  .put('/auth/forgot', isVerified, validation.forgot, runValidation, forgot)
  .put('/auth/reset/:token', isVerified, validation.reset, runValidation, reset);

module.exports = router;
