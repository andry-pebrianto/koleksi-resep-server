const { failed } = require('../utils/createResponse');

module.exports = (req, res, next) => {
  try {
    if (req.files.photo) {
      if (req.files.photo[0].size > 2000000) {
        failed(res, {
          code: 400,
          payload: 'File photo too large',
          message: 'Upload File Error',
        });
      }
    }

    next();
  } catch (error) {
    console.log(error);
    failed(res, {
      code: 500,
      payload: error.message,
      message: 'Internal Server Error',
    });
  }
};
