const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const isVerified = require('../middlewares/isVerified');
const {
  list,
  detail,
  update,
  remove,
  listRecipe,
} = require('../controllers/user.controller');

const router = express.Router();

router
  .get('/user', jwtAuth, isVerified, list)
  .get('/user/:id', jwtAuth, isVerified, detail)
  .put('/user/:id', jwtAuth, isVerified, update)
  .delete('/user/:id', jwtAuth, isVerified, remove)
  .get('/user/:id/recipe', jwtAuth, isVerified, listRecipe);

module.exports = router;
