const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const authModel = require('../models/auth.model');
const userModel = require('../models/user.model');
const { success, failed } = require('../utils/createResponse');
const sendEmail = require('../utils/email/sendEmail');
const activateAccountEmail = require('../utils/email/activateAccountEmail');
const jwtToken = require('../utils/generateJwtToken');

module.exports = {
  register: async (req, res) => {
    res.json("Berhasil");
    return;

    try {
      const user = await userModel.selectByEmail(req.body.email);
      if (user.rowCount) {
        failed(res, {
          code: 400,
          payload: 'Email already exist',
          message: 'Register failed',
        });
        return;
      }

      const password = await bcrypt.hash(req.body.password, 10);
      const photo = req.file.filename;
      const token = crypto.randomBytes(30).toString('hex');
      await authModel.register({
        ...req.body,
        password,
        level: 1,
        id: uuidv4(),
        photo,
        token,
      });

      // send email for activate account
      const templateEmail = {
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
        to: req.body.email.toLowerCase(),
        subject: 'Activate Your Account!',
        html: activateAccountEmail(
          `${process.env.CLIENT_URL}/auth/activate/${token}`,
        ),
      };
      sendEmail(templateEmail);

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
  activation: async (req, res) => {
    try {
      const { token } = req.params;
      const user = await authModel.checkEmailToken(token);

      if (!user.rowCount) {
        failed(res, {
          code: 401,
          payload: 'Token invalid',
          message: 'Activation failed',
        });
        return;
      }
      await authModel.activateEmail(user.rows[0].id);

      success(res, {
        code: 200,
        payload: null,
        message: 'User activation success',
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
