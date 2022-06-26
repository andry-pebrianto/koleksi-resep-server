const express = require('express');
const jwtAuth = require('../middlewares/jwtAuth');
const validation = require('../validations/comment.validation');
const runValidation = require('../middlewares/runValidation');
const { onlyAdmin, onlyUser, commentOwner } = require('../middlewares/authorization');

const {
  list,
  detail,
  insert,
  update,
  remove,
  banned,
} = require('../controllers/comment.controller');

const router = express.Router();

router
  // semua role
  .get('/comment', jwtAuth, list)
  // semua role
  .get('/comment/:id', jwtAuth, detail)
  // hanya user
  .post('/comment', jwtAuth, onlyUser, validation.insert, runValidation, insert)
  // hanya user dan pemilik
  .put('/comment/:id', jwtAuth, onlyUser, commentOwner, validation.insert, runValidation, update)
  // hanya user dan pemilik
  .delete('/comment/:id', jwtAuth, onlyUser, commentOwner, remove)
  // hanya admin
  .put('/comment/banned/:id', jwtAuth, onlyAdmin, banned);

module.exports = router;
