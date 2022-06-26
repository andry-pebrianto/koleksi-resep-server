const { failed } = require('../utils/createResponse');

module.exports = (req, res, next) => {
  const { token } = req.headers;

  if (token && token === '123') {
    next();
  } else {
    failed(res, {
      code: 401,
      payload: 'Token Invalid',
      message: 'Unauthorized',
    });
  }
};
