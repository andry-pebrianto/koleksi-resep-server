const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const authModel = require('../models/auth.model');
const userModel = require('../models/user.model');
const { success, failed } = require('../utils/createResponse');
const sendEmail = require('../utils/email/sendEmail');
const activateAccountEmail = require('../utils/email/activateAccountEmail');
const jwtToken = require('../utils/generateJwtToken');
const { APP_NAME, EMAIL_FROM, CLIENT_URL } = require('../utils/env');

module.exports = {
  register: async (req, res) => {
    try {
      const user = await userModel.selectByEmail(req.body.email);
      if (user.rowCount) {
        failed(res, {
          code: 409,
          payload: 'Email already exist',
          message: 'Register Failed',
        });
        return;
      }

      const password = await bcrypt.hash(req.body.password, 10);
      const photo = req.file.filename;
      const token = crypto.randomBytes(30).toString('hex');
      await authModel.register({
        id: uuidv4(),
        ...req.body,
        password,
        photo,
        level: 1,
        token,
      });

      // send email for activate account
      const templateEmail = {
        from: `"${APP_NAME}" <${EMAIL_FROM}>`,
        to: req.body.email.toLowerCase(),
        subject: 'Activate Your Account!',
        html: activateAccountEmail(
          `${CLIENT_URL}/auth/activation/${token}`,
        ),
      };
      sendEmail(templateEmail);

      success(res, {
        code: 201,
        payload: null,
        message: 'Register Success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'InternalServer Error',
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
            code: 200,
            payload: null,
            message: 'Login Success',
            token,
          });
          return;
        }
      }

      failed(res, {
        code: 401,
        payload: 'Wrong Email or Password',
        message: 'Login Failed',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  activation: async (req, res) => {
    try {
      const { token } = req.params;
      const user = await authModel.checkEmailToken(token);

      if (!user.rowCount) {
        failed(res, {
          code: 401,
          payload: 'Token invalid',
          message: 'Activation Failed',
        });
        return;
      }
      await authModel.activateEmail(user.rows[0].id);

      success(res, {
        code: 200,
        payload: null,
        message: 'Activation Success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
};
