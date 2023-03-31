const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const validation = require('../validations/user.validation');
const runValidation = require('../middlewares/runValidation');
const {
  list,
  detail,
  update,
  updatePassword,
  remove,
  listRecipe,
  banned,
} = require('../controllers/user.controller');
const { myself, onlyAdmin } = require('../middlewares/authorization');

const router = express.Router();

router
  // semua role
  .get('/user', jwtAuth, list)
  // semua role
  .get('/user/:id', jwtAuth, detail)
  // hanya pemilik
  .put('/user/:id', jwtAuth, validation.update, runValidation, myself, update)
  // hanya pemilik
  .put('/user/:id/password', jwtAuth, validation.password, runValidation, myself, updatePassword)
  // hanya pemilik
  .delete('/user/:id', jwtAuth, myself, remove)
  // hanya admin
  .put('/user/banned/:id', jwtAuth, onlyAdmin, banned)
  // semua role
  .get('/user/:id/recipe', jwtAuth, listRecipe);

module.exports = router;
