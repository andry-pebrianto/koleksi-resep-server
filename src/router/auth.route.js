const express = require('express');
const validation = require('../validations/auth.validation');
const runValidation = require('../middlewares/runValidation');
const uploadPhoto = require('../middlewares/uploadPhoto');
const isVerified = require('../middlewares/isVerified');
const {
  register,
  login,
  activation,
} = require('../controllers/auth.controller');

const router = express.Router();

router
  .post('/auth/register', uploadPhoto, validation.register, runValidation, register)
  .post('/auth/login', isVerified, validation.login, runValidation, login)
  .get('/auth/activation/:token', activation);

module.exports = router;
