const db = require('../config/db');

module.exports = {
  register: (body) =>
    new Promise((resolve, reject) => {
      const {
        name, email, phone, password, photo = '',
      } = body;

      db.query(
        'INSERT INTO users (name, email, phone, password, photo) VALUES ($1, $2, $3, $4, $5)',
        [name, email, phone, password, photo],
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
