const { check } = require('express-validator');

const update = [
  // name
  check('name', 'Name required').not().isEmpty(),
  check('name', 'Name only can contains alphabet').isAlpha('en-US', { ignore: ' ' }),
  check('name', 'Name maximum length is 50 characters').isLength({ max: 50 }),
  // email
  check('email', 'Email required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('email', 'Email maximum length is 50 characters').isLength({ max: 50 }),
  // phone
  check('phone', 'Phone required').not().isEmpty(),
  check('phone', 'Phone only can contains number').isNumeric(),
  check('phone', 'Phone maximum length is 13 characters').isLength({ max: 13 }),
];

module.exports = { update };
