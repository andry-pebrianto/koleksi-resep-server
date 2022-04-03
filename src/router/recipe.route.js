const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const validation = require('../validations/recipe.validation');
const runValidation = require('../middlewares/runValidation');
const upload = require('../middlewares/upload');
const {
  list,
  detail,
  insert,
  update,
  remove,
  listComment,
  latest,
} = require('../controllers/recipe.controller');

const router = express.Router();

router
  .get('/recipe', jwtAuth, list)
  .get('/recipe/latest', latest)
  .get('/recipe/:id', jwtAuth, detail)
  .post('/recipe', jwtAuth, upload, validation.insert, runValidation, insert) // Sampai Sini
  .put('/recipe/:id', jwtAuth, upload, validation.insert, runValidation, update)
  .delete('/recipe/:id', jwtAuth, remove)
  .get('/recipe/:id/comment', jwtAuth, listComment);

module.exports = router;
