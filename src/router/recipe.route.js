const express = require('express');
const {
  list,
  detail,
  insert,
  update,
  remove,
} = require('../controllers/recipe.controller');

const router = express.Router();

router
  .get('/recipe', list)
  .get('/recipe/:id', detail)
  .post('/recipe', insert)
  .put('/recipe/:id', update)
  .delete('/recipe/:id', remove);

module.exports = router;
