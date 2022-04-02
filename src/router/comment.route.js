const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const {
  list,
  detail,
  insert,
  update,
  remove,
} = require('../controllers/comment.controller');

const router = express.Router();

router
  .get('/comment', jwtAuth, list)
  .get('/comment/:id', jwtAuth, detail)
  .post('/comment', jwtAuth, insert)
  .put('/comment/:id', jwtAuth, update)
  .delete('/comment/:id', jwtAuth, remove);

module.exports = router;
