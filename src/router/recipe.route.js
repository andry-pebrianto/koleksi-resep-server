const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
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
  .post('/recipe', jwtAuth, insert)
  .put('/recipe/:id', jwtAuth, update)
  .delete('/recipe/:id', jwtAuth, remove)
  .get('/recipe/:id/comment', jwtAuth, listComment);

module.exports = router;
