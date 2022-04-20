const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const authModel = require('../models/auth.model');
const userModel = require('../models/user.model');
const { success, failed } = require('../utils/createResponse');
const sendEmail = require('../utils/email/sendEmail');
const activateAccountEmail = require('../utils/email/activateAccountEmail');
const jwtToken = require('../utils/generateJwtToken');
const deleteFile = require('../utils/deleteFile');
const { APP_NAME, EMAIL_FROM, CLIENT_URL } = require('../utils/env');

module.exports = {
  register: async (req, res) => {
    try {
      const user = await userModel.selectByEmail(req.body.email);
      if (user.rowCount) {
        // menghapus photo jika ada
        if (req.files) {
          if (req.files.photo) {
            deleteFile(req.files.photo[0].path);
          }
        }

        failed(res, {
          code: 409,
          payload: 'Email already exist',
          message: 'Register Failed',
        });
        return;
      }

      const password = await bcrypt.hash(req.body.password, 10);
      let photo = 'profile-default.jpg';
      // jika register disertai photo
      if (req.files) {
        if (req.files.photo) {
          photo = req.files.photo[0].filename;
        }
      }
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
        message: 'Internal Server Error',
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authModel.login(email);

      // jika user ditemukan
      if (user.rowCount > 0) {
        // jika user tidak terbanned
        if (user.rows[0].is_active) {
          const match = await bcrypt.compare(password, user.rows[0].password);
          // jika password benar
          if (match) {
            const jwt = await jwtToken({ id: user.rows[0].id, level: user.rows[0].level });
            success(res, {
              code: 200,
              payload: null,
              message: 'Login Success',
              token: {
                jwt,
                id: user.rows[0].id,
              },
            });
            return;
          }
        } else {
          failed(res, {
            code: 403,
            payload: 'Your account has been banned',
            message: 'Login Failed',
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
        res.send(`
        <div>
          <h1>Activation Failed</h1>
          <h3>Token invalid</h3>
        </div>`);
        return;
      }
      await authModel.activateEmail(user.rows[0].id);

      res.send(`
      <div>
        <h1>Activation Success</h1>
        <h3>You can Login now</h3>
      </div>`);
    } catch (error) {
      res.send(`
      <div>
        <h1>Activation Failed</h1>
        <h3>${error.message}</h3>
      </div>`);
    }
  },
};
