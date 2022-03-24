const db = require('../config/db');

module.exports = {
  selectAll: () =>
    new Promise((resolve, reject) => {
      db.query('SELECT * FROM comment', (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectById: (id) =>
    new Promise((resolve, reject) => {
      db.query('SELECT * FROM comment WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  store: (body) =>
    new Promise((resolve, reject) => {
      const { recipe_id, comment_text, user_id } = body;

      db.query(
        'INSERT INTO comment (recipe_id, comment_text, user_id) VALUES ($1, $2, $3)',
        [recipe_id, comment_text, user_id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    }),
  updateById: (id, body) =>
    new Promise((resolve, reject) => {
      const { recipe_id, comment_text, user_id } = body;

      db.query(
        'UPDATE comment SET recipe_id=$1, comment_text=$2, user_id=$3 WHERE id=$4',
        [recipe_id, comment_text, user_id, id],
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
      db.query('DELETE FROM comment WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
};
