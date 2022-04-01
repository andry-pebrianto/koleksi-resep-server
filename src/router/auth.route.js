const express = require('express');
const validation = require('../validations/auth.validation');
const runValidation = require('../middlewares/runValidation');
const upload = require('../middlewares/upload');
const {
  register,
  login,
  activation,
} = require('../controllers/auth.controller');

const router = express.Router();

router
  .post('/auth/register', upload, validation.register, runValidation, register)
  .post('/auth/login', login)
  .get('/auth/activation/:token', activation);

module.exports = router;
