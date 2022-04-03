const db = require('../config/db');

module.exports = {
  selectAll: (paging) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users LIMIT ${paging.limit} OFFSET ${paging.offset}`, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectById: (id) =>
    new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectByEmail: (email) =>
    new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email=$1', [email], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  updateById: (id, body) =>
    new Promise((resolve, reject) => {
      const {
        name, email, phone, photo = '',
      } = body;

      db.query(
        'UPDATE users SET name=$1, email=$2, phone=$3, photo=$4 WHERE id=$5',
        [name, email, phone, photo, id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    }),
  removeById: (id) =>
    new Promise((resolve, reject) => {
      db.query('DELETE FROM users WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  bannedById: (id) =>
    new Promise((resolve, reject) => {
      db.query('UPDATE users SET is_active=0 WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  unbannedById: (id) =>
    new Promise((resolve, reject) => {
      db.query('UPDATE users SET is_active=1 WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  countAll: () =>
    new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) FROM users', (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
};
