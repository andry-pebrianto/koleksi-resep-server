const express = require('express');
const {
  list,
  detail,
  insert,
  update,
  remove,
} = require('../controllers/comment.controller');

const router = express.Router();

router
  .get('/comment', list)
  .get('/comment/:id', detail)
  .post('/comment', insert)
  .put('/comment/:id', update)
  .delete('/comment/:id', remove);

module.exports = router;
