const userModel = require('../models/user.model');
const { failed } = require('../utils/createResponse');

module.exports = async (req, res, next) => {
  try {
    const user = await userModel.selectById(req.APP_DATA.tokenDecoded.id);

    if (user.rows[0].verified === 1) {
      next();
    } else {
      failed(res, {
        code: 401,
        payload: 'Your email is not verified yet',
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
};
