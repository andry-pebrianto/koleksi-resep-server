const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const validation = require('../validations/comment.validation');
const runValidation = require('../middlewares/runValidation');
const { onlyUser, commentOwner } = require('../middlewares/authorization');

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
  .post('/comment', jwtAuth, onlyUser, validation.insert, runValidation, insert)
  .put('/comment/:id', jwtAuth, onlyUser, commentOwner, validation.insert, runValidation, update)
  .delete('/comment/:id', jwtAuth, onlyUser, commentOwner, remove);

module.exports = router;
