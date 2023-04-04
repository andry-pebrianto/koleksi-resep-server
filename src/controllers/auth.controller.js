const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const authModel = require("../models/auth.model");
const userModel = require("../models/user.model");
const { success, failed } = require("../utils/createResponse");
const sendEmail = require("../utils/email/sendEmail");
const activateAccountEmail = require("../utils/email/activateAccountEmail");
const resetAccountEmail = require("../utils/email/resetAccountEmail");
const jwtToken = require("../utils/generateJwtToken");
const {
  APP_NAME,
  EMAIL_FROM,
  API_URL,
  CLIENT_URL,
  REFRESH_TOKEN_KEY,
  GOOGLE_CLIENT_ID,
} = require("../utils/env");

module.exports = {
  register: async (req, res) => {
    try {
      const { fullName, email, password } = req.body;

      const user = await userModel.selectByEmail(email);
      if (user.rowCount) {
        failed(res, {
          code: 409,
          payload: "Email already exist",
          message: "Register Failed",
        });
        return;
      }

      const passwordHashed = await bcrypt.hash(password, 10);
      const token = crypto.randomBytes(30).toString("hex");
      const insertData = await authModel.register({
        fullName,
        email,
        password: passwordHashed,
      });
      await authModel.updateToken(insertData.rows[0].id, token);

      // send email for activate account
      const templateEmail = {
        from: `"${APP_NAME}" <${EMAIL_FROM}>`,
        to: req.body.email.toLowerCase(),
        subject: "Activate Your Account!",
        html: activateAccountEmail(`${API_URL}/auth/activation/${token}`),
      };
      sendEmail(templateEmail);

      success(res, {
        code: 201,
        payload: null,
        message: "Register Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.selectByEmail(email);

      if (user.rowCount) {
        if (user.rows[0].is_active) {
          if (!user.rows[0].google_id) {
            const match = await bcrypt.compare(password, user.rows[0].password);

            if (match) {
              const refreshToken = await jwtToken.generateRefreshToken({
                id: user.rows[0].id,
                level: user.rows[0].level,
              });
              const accessToken = await jwtToken.generateAccessToken({
                id: user.rows[0].id,
                level: user.rows[0].level,
              });

              await authModel.deleteRefreshToken(user.rows[0].id);
              await authModel.insertRefreshToken(user.rows[0].id, refreshToken);

              success(res, {
                code: 200,
                payload: null,
                message: "Login Success",
                token: {
                  refreshToken,
                  accessToken,
                  id: user.rows[0].id,
                },
              });
              return;
            }
          } else {
            failed(res, {
              code: 400,
              payload:
                "Your email has been linked with Google. Please login with Google.",
              message: "Login Failed",
            });
            return;
          }
        } else {
          failed(res, {
            code: 403,
            payload: "Your account has been banned or deleted",
            message: "Login Failed",
          });
          return;
        }
      }

      failed(res, {
        code: 401,
        payload: "Wrong Email or Password",
        message: "Login Failed",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  googleAuth: async (req, res) => {
    try {
      const client = new OAuth2Client(GOOGLE_CLIENT_ID);

      const response = await client.verifyIdToken({
        idToken: req.body.tokenId,
        audience: GOOGLE_CLIENT_ID,
      });

      // if google email not verified
      if (!response.payload.email_verified) {
        failed(res, {
          code: 400,
          payload: "Email not verified by Google.",
          message: "Login Failed",
        });
        return;
      }

      const user = await userModel.selectByEmail(response.payload.email);

      // already registered
      if (user.rowCount) {
        if (user.rows[0].google_id) {
          const refreshToken = await jwtToken.generateRefreshToken({
            id: user.rows[0].id,
            level: user.rows[0].level,
          });
          const accessToken = await jwtToken.generateAccessToken({
            id: user.rows[0].id,
            level: user.rows[0].level,
          });

          await authModel.deleteRefreshToken(user.rows[0].id);
          await authModel.insertRefreshToken(user.rows[0].id, refreshToken);

          success(res, {
            code: 200,
            payload: null,
            message: "Login With Google Success",
            token: {
              refreshToken,
              accessToken,
              id: user.rows[0].id,
            },
          });
          return;
        } else {
          failed(res, {
            code: 400,
            payload:
              "Your email has not been linked with Google. Please log in with your email and password.",
            message: "Login Failed",
          });
          return;
        }
      }

      // not registered yet
      const { sub, name, email, picture } = response.payload;

      const insertData = await authModel.registerWithGoogle({
        sub,
        name,
        email,
        picture,
      });

      const refreshToken = await jwtToken.generateRefreshToken({
        id: insertData.rows[0].id,
        level: 2,
      });
      const accessToken = await jwtToken.generateAccessToken({
        id: insertData.rows[0].id,
        level: 2,
      });

      await authModel.deleteRefreshToken(insertData.rows[0].id);
      await authModel.insertRefreshToken(insertData.rows[0].id, refreshToken);

      success(res, {
        code: 201,
        payload: null,
        message: "Register With Google Success",
        token: {
          refreshToken,
          accessToken,
          id: insertData.rows[0].id,
        },
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
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
      await authModel.updateToken(user.rows[0].id, "");

      res.send(`
      <div>
        <h1>Activation Success</h1>
        <h3>You can login now</h3>
      </div>`);
    } catch (error) {
      res.send(`
      <div>
        <h1>Activation Failed</h1>
        <h3>${error.message}</h3>
      </div>`);
    }
  },
  forgot: async (req, res) => {
    try {
      const user = await userModel.selectByEmail(req.body.email);
      if (user.rowCount) {
        if (user.rows[0].google_id) {
          failed(res, {
            code: 400,
            payload:
              "Email linked with Google cannot reset password. Please log in with Google.",
            message: "Forgot Password Failed",
          });
          return;
        }

        const token = crypto.randomBytes(30).toString("hex");
        await authModel.updateToken(user.rows[0].id, token);

        // send email for reset password
        const templateEmail = {
          from: `"${APP_NAME}" <${EMAIL_FROM}>`,
          to: req.body.email.toLowerCase(),
          subject: "Reset Your Password!",
          html: resetAccountEmail(`${CLIENT_URL}/auth/reset/${token}`),
        };
        sendEmail(templateEmail);
      }

      success(res, {
        code: 200,
        payload: null,
        message: "Forgot Password Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  reset: async (req, res) => {
    try {
      const { token } = req.params;
      const user = await authModel.checkEmailToken(token);

      if (!user.rowCount) {
        failed(res, {
          code: 401,
          payload: "Token invalid",
          message: "Reset Password Failed",
        });
        return;
      }

      const password = await bcrypt.hash(req.body.password, 10);
      await authModel.resetPassword(user.rows[0].id, password);
      await authModel.updateToken(user.rows[0].id, "");

      success(res, {
        code: 200,
        payload: null,
        message: "Reset Password Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  refreshAccessToken: async (req, res) => {
    try {
      const { token } = req.params;
      const decoded = jwt.verify(token, REFRESH_TOKEN_KEY);

      const refreshToken = await authModel.checkRefreshToken(token);
      if (!refreshToken.rowCount) {
        failed(res, {
          code: 401,
          payload: "Token Invalid",
          message: "Unauthorized",
        });
        return;
      }

      const accessToken = await jwtToken.generateAccessToken({
        id: decoded.id,
        level: decoded.level,
      });

      success(res, {
        code: 200,
        payload: null,
        message: "Access Token Updated",
        token: {
          accessToken,
        },
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  logout: async (req, res) => {
    try {
      const { token } = req.params;
      const refreshToken = await authModel.checkRefreshToken(token);

      if (refreshToken.rowCount) {
        await authModel.deleteRefreshToken(refreshToken.rows[0].user_id);
      }

      success(res, {
        code: 200,
        payload: null,
        message: "Logout Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
};
