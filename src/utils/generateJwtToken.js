const jwt = require("jsonwebtoken");
const { REFRESH_TOKEN_KEY, ACCESS_TOKEN_KEY } = require("./env");

const generateRefreshToken = async (payload) => {
  const token = jwt.sign(payload, REFRESH_TOKEN_KEY, {
    expiresIn: 604800,
  });

  return token;
};

const generateAccessToken = async (payload) => {
  const token = jwt.sign(payload, ACCESS_TOKEN_KEY, {
    expiresIn: 120,
  });

  return token;
};

module.exports = { generateRefreshToken, generateAccessToken };
