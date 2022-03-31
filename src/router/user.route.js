const express = require('express');
const staticAuth = require('../middlewares/staticAuth');
const {
  list,
  detail,
  insert,
  update,
  remove,
  listRecipe,
} = require('../controllers/user.controller');

const router = express.Router();

router
  .get('/user', staticAuth, list)
  .get('/user/:id', detail)
  .post('/user', insert)
  .put('/user/:id', update)
  .delete('/user/:id', remove)
  .get('/user/:id/recipe', listRecipe);

module.exports = router;
