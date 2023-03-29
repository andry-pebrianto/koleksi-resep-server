const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

module.exports = {
  register: (body) =>
    new Promise((resolve, reject) => {
      const { fullName, email, password, photo = "" } = body;

      db.query(
        "INSERT INTO users (id, full_name, email, password, photo_url) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [uuidv4(), fullName, email.toLowerCase(), password, photo],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  login: (email) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email=$1",
        [email],
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
