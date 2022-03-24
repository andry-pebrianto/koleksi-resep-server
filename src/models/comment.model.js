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
      const {
        title,
        ingredients,
        video = '',
        date,
        user_id,
        photo = '',
      } = body;

      db.query(
        'UPDATE recipe SET title=$1, ingredients=$2, video=$3, date=$4, user_id=$5, photo=$6 WHERE id=$7',
        [title, ingredients, video, date, user_id, photo, id],
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
      db.query('DELETE FROM recipe WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
};
