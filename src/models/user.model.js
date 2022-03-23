const db = require("../config/db");

module.exports = {
  selectAll: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users", (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },
  selectById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE id=$1`, [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },
  store: ({ name, email, phone, password, photo = "" }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users (name, email, phone, password, photo) VALUES ($1, $2, $3, $4, $5)`, [name, email, phone, password, photo],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    });
  },
};
