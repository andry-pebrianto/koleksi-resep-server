const express = require('express');
const validation = require('../validations/auth.validation');
const runValidation = require('../middlewares/runValidation');
const { isVerified } = require('../middlewares/authorization');
const {
  register,
  login,
  googleAuth,
  activation,
  forgot,
  reset,
  refreshAccessToken,
  logout,
} = require('../controllers/auth.controller');

const router = express.Router();

router
  .post('/auth/register', validation.register, runValidation, register)
  .get('/auth/activation/:token', activation)
  .post('/auth/login', isVerified, validation.login, runValidation, login)
  .post('/auth/google', validation.googleAuth, runValidation, googleAuth)
  .put('/auth/forgot', isVerified, validation.forgot, runValidation, forgot)
  .put('/auth/reset/:token', validation.reset, runValidation, reset)
  .put('/auth/refresh/:token', refreshAccessToken)
  .delete('/auth/logout/:token', logout);

module.exports = router;
