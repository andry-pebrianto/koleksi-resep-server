const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const validation = require('../validations/recipe.validation');
const runValidation = require('../middlewares/runValidation');
const upload = require('../middlewares/upload');
const { onlyUser } = require('../middlewares/authorization');
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
  .get('/recipe', jwtAuth, list)
  .get('/recipe/latest', latest)
  .get('/recipe/:id', jwtAuth, detail)
  .post('/recipe', jwtAuth, onlyUser, upload, validation.insert, runValidation, insert)
  .put('/recipe/:id', jwtAuth, onlyUser, upload, validation.insert, runValidation, update)
  .put('/recipe/banned/:id', jwtAuth, banned)
  .put('/recipe/unbanned/:id', jwtAuth, unbanned)
  .delete('/recipe/:id', jwtAuth, remove)
  .get('/recipe/:id/comment', jwtAuth, listComment);

module.exports = router;
