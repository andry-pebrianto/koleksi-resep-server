const db = require('../config/db');

module.exports = {
  register: (body) =>
    new Promise((resolve, reject) => {
      const {
        id, name, email, phone, password, photo, level,
      } = body;

      db.query(
        'INSERT INTO users (id, name, email, phone, password, photo, level) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [id, name, email.toLowerCase(), phone, password, photo, level],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    }),
  login: (email) =>
    new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE email=$1',
        [email],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    }),
  checkEmailToken: (token) =>
    new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE email_token=$1',
        [token],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    }),
  activateEmail: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET verified=1 WHERE id=$1',
        [id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    }),
  resetPassword: (id, password) =>
    new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET password=$1 WHERE id=$2',
        [password, id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    }),
  updateToken: (id, token) =>
    new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET email_token=$1 WHERE id=$2',
        [token, id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    }),
};
