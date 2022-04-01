const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const isVerified = require('../middlewares/isVerified');
const {
  list,
  detail,
  insert,
  update,
  remove,
} = require('../controllers/comment.controller');

const router = express.Router();

router
  .get('/comment', jwtAuth, isVerified, list)
  .get('/comment/:id', jwtAuth, isVerified, detail)
  .post('/comment', jwtAuth, isVerified, insert)
  .put('/comment/:id', jwtAuth, isVerified, update)
  .delete('/comment/:id', jwtAuth, isVerified, remove);

module.exports = router;
