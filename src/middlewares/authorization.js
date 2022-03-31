const { failed } = require('../utils/createResponse');

module.exports = {
  isAdmin: (req, res, next) => {
    if (req.APP_DATA.tokenDecoded.level === 0) {
      next();
    } else {
      failed(res, {
        code: 401,
        payload: 'Anda tidak punya otoritas untuk mengakses sumber ini',
        message: 'Unauthorized',
      });
    }
  },
  isCustomer: (req, res, next) => {
    if (req.APP_DATA.tokenDecoded.level === 1) {
      next();
    } else {
      failed(res, {
        code: 401,
        payload: 'Anda tidak punya otoritas untuk mengakses sumber ini',
        message: 'Unauthorized',
      });
    }
  },
};
