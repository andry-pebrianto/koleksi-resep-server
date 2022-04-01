const userModel = require('../models/user.model');
const { failed } = require('../utils/createResponse');

module.exports = {
  onlyAdmin: async (req, res, next) => {
    try {
      const user = await userModel.selectById(req.APP_DATA.tokenDecoded.id);

      if (user.rows[0].id === 0) {
        next();
      } else {
        failed(res, {
          code: 401,
          payload: 'You do not have access',
          message: 'Unauthorized',
        });
      }
    } catch (error) {
      failed(res, {
        code: 401,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
  onlyUser: async (req, res, next) => {
    try {
      const user = await userModel.selectById(req.APP_DATA.tokenDecoded.id);

      if (user.rows[0].id === 1) {
        next();
      } else {
        failed(res, {
          code: 401,
          payload: 'You do not have access',
          message: 'Unauthorized',
        });
      }
    } catch (error) {
      failed(res, {
        code: 401,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
};
