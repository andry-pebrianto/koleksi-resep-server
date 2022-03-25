const db = require('../config/db');

module.exports = {
  selectAll: (paging, search = '') =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM recipe WHERE LOWER(title) LIKE '%'||LOWER($1)||'%' LIMIT ${paging.limit} OFFSET ${paging.offset}`, [search.trim()], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectById: (id) =>
    new Promise((resolve, reject) => {
      db.query('SELECT * FROM recipe WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  store: (body) =>
    new Promise((resolve, reject) => {
      const {
        title,
        ingredients,
        video = '',
        date,
        userId,
        photo = '',
      } = body;

      db.query(
        'INSERT INTO recipe (title, ingredients, video, date, user_id, photo) VALUES ($1, $2, $3, $4, $5, $6)',
        [title, ingredients, video, date, userId, photo],
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
        userId,
        photo = '',
      } = body;

      db.query(
        'UPDATE recipe SET title=$1, ingredients=$2, video=$3, date=$4, user_id=$5, photo=$6 WHERE id=$7',
        [title, ingredients, video, date, userId, photo, id],
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
  selectAllCommentByRecipe: (id) =>
    new Promise((resolve, reject) => {
      db.query('SELECT * FROM comment WHERE recipe_id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectLatest: () =>
    new Promise((resolve, reject) => {
      db.query('SELECT * FROM recipe ORDER BY date DESC LIMIT 5', (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
};
