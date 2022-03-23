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
        `INSERT INTO users (name, email, phone, password, photo) VALUES ($1, $2, $3, $4, $5)`,
        [name, email, phone, password, photo],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    });
  },
  updateById: ({ id, name, email, phone, password, photo = "" }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users SET name=$1, email=$2, phone=$3, password=$4, photo=$5 WHERE id=$6`,
        [name, email, phone, password, photo, id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    });
  },
  removeById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM users WHERE id=$1`,
        [id],
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
