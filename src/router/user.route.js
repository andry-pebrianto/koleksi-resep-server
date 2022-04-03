const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const validation = require('../validations/user.validation');
const runValidation = require('../middlewares/runValidation');
const upload = require('../middlewares/upload');
const {
  list,
  detail,
  update,
  remove,
  listRecipe,
  banned,
  unbanned,
} = require('../controllers/user.controller');
const { myself, onlyAdmin } = require('../middlewares/authorization');

const router = express.Router();

router
  // semua role
  .get('/user', jwtAuth, list)
  // semua role
  .get('/user/:id', jwtAuth, detail)
  // hanya pemilik
  .put('/user/:id', jwtAuth, upload, validation.update, runValidation, myself, update)
  // hanya pemilik
  .delete('/user/:id', jwtAuth, myself, remove)
  // hanya admin
  .put('/user/banned/:id', jwtAuth, onlyAdmin, banned)
  // hanya admin
  .put('/user/unbanned/:id', jwtAuth, onlyAdmin, unbanned)
  // semua role
  .get('/user/:id/recipe', jwtAuth, listRecipe);

module.exports = router;
