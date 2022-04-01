const userModel = require('../models/user.model');
const { failed } = require('../utils/createResponse');

module.exports = async (req, res, next) => {
  try {
    const user = await userModel.selectByEmail(req.body.email);

    if (!user.rowCount) {
      next();
    } else if (user.rows[0].verified === 1) {
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
      code: 500,
      payload: error.message,
      message: 'Internal Server Error',
    });
  }
};
