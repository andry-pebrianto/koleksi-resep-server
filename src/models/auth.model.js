const db = require('../config/db');

module.exports = {
  register: (body) =>
    new Promise((resolve, reject) => {
      const {
        id, name, email, phone, password, photo = '', level,
      } = body;

      db.query(
        'INSERT INTO users (id, name, email, phone, password, photo, level) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, name, email, phone, password, photo, level],
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
};
