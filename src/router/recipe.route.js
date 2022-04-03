const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const validation = require('../validations/recipe.validation');
const runValidation = require('../middlewares/runValidation');
const upload = require('../middlewares/upload');
const { onlyAdmin, onlyUser, recipeOwner } = require('../middlewares/authorization');
const {
  list,
  detail,
  insert,
  update,
  remove,
  banned,
  unbanned,
  listComment,
  latest,
} = require('../controllers/recipe.controller');

const router = express.Router();

router
  // semua role
  .get('/recipe', jwtAuth, list)
  // semua pengguna internet
  .get('/recipe/latest', latest)
  // semua role
  .get('/recipe/:id', jwtAuth, detail)
  // hanya user
  .post('/recipe', jwtAuth, onlyUser, upload, validation.insert, runValidation, insert)
  // hanya user dan pemilik
  .put('/recipe/:id', jwtAuth, onlyUser, recipeOwner, upload, validation.insert, runValidation, update)
  // hanya user dan pemilik
  .delete('/recipe/:id', jwtAuth, onlyUser, recipeOwner, remove)
  // hanya admin
  .put('/recipe/banned/:id', jwtAuth, onlyAdmin, banned)
  // hanya admin
  .put('/recipe/unbanned/:id', jwtAuth, onlyAdmin, unbanned)
  // semua role
  .get('/recipe/:id/comment', jwtAuth, listComment); // belum

module.exports = router;
