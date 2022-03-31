const bcrypt = require('bcrypt');
const authModel = require('../models/auth.model');
const { success, failed } = require('../utils/createResponse');
const jwtToken = require('../utils/generateJwtToken');

module.exports = {
  register: async (req, res) => {
    try {
      const password = await bcrypt.hash(req.body.password, 10);
      await authModel.register({ ...req.body, password });

      success(res, {
        code: 201,
        payload: null,
        message: 'Register success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authModel.login(email);

      // jika user ditemukan
      if (user.rowCount > 0) {
        const match = await bcrypt.compare(password, user.rows[0].password);
        // jika password benar
        if (match) {
          const token = await jwtToken(user.rows[0]);
          success(res, {
            code: 201,
            payload: null,
            message: 'Login success',
            token,
          });
          return;
        }
      }

      failed(res, {
        code: 401,
        payload: 'Wrong email or password',
        message: 'Login failed',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
};
