const db = require('../config/db');

module.exports = {
  register: (body) =>
    new Promise((resolve, reject) => {
      const {
        id, name, email, phone, password, photo = '', level, token,
      } = body;

      db.query(
        'INSERT INTO users (id, name, email, phone, password, photo, level, email_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [id, name, email, phone, password, photo, level, token],
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
        'UPDATE users SET email_token=\'\', verified=1 WHERE id=$1',
        [id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    }),
};
