const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

module.exports = {
  register: (body) =>
    new Promise((resolve, reject) => {
      const { fullName, email, password } = body;

      db.query(
        "INSERT INTO users (id, full_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [uuidv4(), fullName, email.toLowerCase(), password],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  registerWithGoogle: (body) =>
    new Promise((resolve, reject) => {
      const { sub, name, email, picture } = body;

      db.query(
        "INSERT INTO users (id, full_name, password, email, photo_url, is_verified, google_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [uuidv4(), name, "", email, picture, 1, sub],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  checkEmailToken: (token) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email_token=$1",
        [token],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  activateEmail: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET is_verified=1 WHERE id=$1",
        [id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  resetPassword: (id, password) =>
    new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET password=$1 WHERE id=$2",
        [password, id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  updateToken: (id, token) =>
    new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET email_token=$1 WHERE id=$2",
        [token, id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  checkRefreshToken: (token) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM authentications WHERE token = $1",
        [token],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  insertRefreshToken: (userId, token) =>
    new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO authentications (id, user_id, token) VALUES ($1, $2, $3)",
        [uuidv4(), userId, token],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  updateRefreshToken: (token) =>
    new Promise((resolve, reject) => {
      db.query(
        "UPDATE authentications SET token=$1 WHERE token = $1",
        [token],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  deleteRefreshToken: (userId) =>
    new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM authentications WHERE user_id = $1",
        [userId],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
};
