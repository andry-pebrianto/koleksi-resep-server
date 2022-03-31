const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
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
  .get('/user', jwtAuth, list)
  .get('/user/:id', jwtAuth, detail)
  .post('/user', jwtAuth, insert)
  .put('/user/:id', jwtAuth, update)
  .delete('/user/:id', jwtAuth, remove)
  .get('/user/:id/recipe', jwtAuth, listRecipe);

module.exports = router;
