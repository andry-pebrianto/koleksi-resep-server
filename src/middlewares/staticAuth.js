const { failed } = require('../utils/createResponse');

module.exports = (req, res, next) => {
  const { token } = req.headers;

  if (token && token === '123') {
    next();
  } else {
    failed(res, {
      code: 403,
      payload: 'Token invalid',
      message: 'Forbidden',
    });
  }
};
