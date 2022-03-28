const db = require('../config/db');

module.exports = {
  selectAll: (paging) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM comment LIMIT ${paging.item} OFFSET ${paging.offset}`, (error, result) => {
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
      const { recipeId, commentText, userId } = body;

      db.query(
        'INSERT INTO comment (recipe_id, comment_text, user_id) VALUES ($1, $2, $3)',
        [recipeId, commentText, userId],
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
      const { recipeId, commentText, userId } = body;

      db.query(
        'UPDATE comment SET recipe_id=$1, comment_text=$2, user_id=$3 WHERE id=$4',
        [recipeId, commentText, userId, id],
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
  selectAllCommentByRecipe: (id) =>
    new Promise((resolve, reject) => {
      db.query('SELECT * FROM comment WHERE recipe_id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
};
