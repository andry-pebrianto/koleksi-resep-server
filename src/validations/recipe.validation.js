const { check } = require('express-validator');

const insert = [
  // title
  check('title', 'Title required').not().isEmpty(),
  check('title', 'Title only can contains alphabet and number').isAlphanumeric('en-US', { ignore: ' ' }),
  check('title', 'Title maximum length is 105 characters').isLength({ max: 105 }),
  // ingredients
  check('ingredients', 'Ingredients required').not().isEmpty(),
];

module.exports = { insert };
