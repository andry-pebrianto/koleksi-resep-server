const express = require('express');
const {
  list,
  detail,
  insert,
  update,
  remove,
  listComment,
} = require('../controllers/recipe.controller');

const router = express.Router();

router
  .get('/recipe', list)
  .get('/recipe/:id', detail)
  .post('/recipe', insert)
  .put('/recipe/:id', update)
  .delete('/recipe/:id', remove)
  .get('/recipe/:id/comment', listComment);

module.exports = router;
