const { check } = require('express-validator');

const register = [
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
  // password
  check('password', 'Password require 8 or more characters').isLength({ min: 8 }),
  check('password', 'Password must include one lowercase character, one uppercase character, a number, and a special character').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
  check('password', "Password can't above 100 characters").isLength({ max: 100 }),
];

const login = [
  // email
  check('email', 'Email required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  // password
  check('password', 'Password required').not().isEmpty(),
];

module.exports = { register, login };
