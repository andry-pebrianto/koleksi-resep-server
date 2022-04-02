const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const {
  list,
  detail,
  update,
  remove,
  listRecipe,
} = require('../controllers/user.controller');
const { myself } = require('../middlewares/authorization');

const router = express.Router();

router
  .get('/user', jwtAuth, list)
  .get('/user/:id', jwtAuth, detail)
  .put('/user/:id', jwtAuth, myself, update)
  .delete('/user/:id', jwtAuth, remove)
  .get('/user/:id/recipe', jwtAuth, listRecipe);

module.exports = router;
