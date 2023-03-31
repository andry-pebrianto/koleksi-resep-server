const { check } = require("express-validator");

const register = [
  // fullName
  check("fullName", "Full Name is required").not().isEmpty(),
  check("fullName", "Full Name only can contains alphabet").isAlpha("en-US", {
    ignore: " ",
  }),
  check("fullName", "FullName maximum length is 50 characters").isLength({
    max: 50,
  }),
  // email
  check("email", "Email is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("email", "Email maximum length is 50 characters").isLength({ max: 50 }),
  // password
  check("password", "Password require 8 or more characters").isLength({
    min: 8,
  }),
  check(
    "password",
    "Password must include one lowercase character, one uppercase character, a number, and a special character"
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  check("password", "Password can't above 200 characters").isLength({
    max: 200,
  }),
];

const googleAuth = [
  // tokenId
  check("tokenId", "Google Token ID is required").not().isEmpty(),
];

const login = [
  // email
  check("email", "Email required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  // password
  check("password", "Password required").not().isEmpty(),
];

const forgot = [
  // email
  check("email", "Email required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
];

const reset = [
  // password
  check("password", "Password require 8 or more characters").isLength({
    min: 8,
  }),
  check(
    "password",
    "Password must include one lowercase character, one uppercase character, a number, and a special character"
  ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  check("password", "Password can't above 200 characters").isLength({
    max: 200,
  }),
];

module.exports = {
  register,
  googleAuth,
  login,
  forgot,
  reset,
};
