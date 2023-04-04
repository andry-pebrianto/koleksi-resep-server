const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const validation = require('../validations/comment.validation');
const runValidation = require('../middlewares/runValidation');
const { onlyUser, commentOwner } = require('../middlewares/authorization');

const {
  insert,
  update,
  remove,
} = require('../controllers/comment.controller');

const router = express.Router();

router
  // hanya user
  .post('/comment', jwtAuth, onlyUser, validation.insert, runValidation, insert)
  // hanya user dan pemilik
  .put('/comment/:id', jwtAuth, onlyUser, commentOwner, validation.update, runValidation, update)
  // hanya user dan pemilik
  .delete('/comment/:id', jwtAuth, onlyUser, commentOwner, remove);

module.exports = router;
