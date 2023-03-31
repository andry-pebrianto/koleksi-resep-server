const { check } = require("express-validator");

const update = [
  // fullName
  check("fullName", "Full Name required").not().isEmpty(),
  check("fullName", "Full Name only can contains alphabet").isAlpha("en-US", {
    ignore: " ",
  }),
  check("fullName", "Name maximum length is 50 characters").isLength({
    max: 50,
  }),
  // birthDate
  check("birthDate", "Birth Date not valid").optional().isDate(),
  // phone
  check("phone", "Phone only can contains number").optional().isNumeric(),
  check("phone", "Phone maximum length is 13 characters")
    .optional()
    .isLength({ max: 13 }),
];

const password = [
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
  // oldPassword
  check("oldPassword", "Old Password required").not().isEmpty(),
];

module.exports = { update, password };
