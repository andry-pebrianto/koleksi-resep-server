const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const isVerified = require('../middlewares/isVerified');
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
  .get('/recipe', jwtAuth, isVerified, list)
  .get('/recipe/latest', latest)
  .get('/recipe/:id', jwtAuth, isVerified, detail)
  .post('/recipe', jwtAuth, isVerified, insert)
  .put('/recipe/:id', jwtAuth, isVerified, update)
  .delete('/recipe/:id', jwtAuth, isVerified, remove)
  .get('/recipe/:id/comment', jwtAuth, isVerified, listComment);

module.exports = router;
