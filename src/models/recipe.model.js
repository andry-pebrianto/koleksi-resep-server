const db = require('../config/db');

module.exports = {
  selectAll: (level, paging, search = '') =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM recipe WHERE LOWER(title) LIKE '%'||LOWER($1)||'%' ${level === 1 ? 'AND is_active=1' : ''} LIMIT ${paging.limit} OFFSET ${paging.offset}`, [search.trim()], (error, result) => {
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
        id,
        title,
        ingredients,
        video = '',
        date,
        userId,
        photo = '',
      } = body;

      db.query(
        'INSERT INTO recipe (id, title, ingredients, video, date, user_id, photo) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, title, ingredients, video, date, userId, photo],
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
        photo = '',
      } = body;

      db.query(
        'UPDATE recipe SET title=$1, ingredients=$2, video=$3, photo=$4 WHERE id=$5',
        [title, ingredients, video, photo, id],
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
  bannedById: (id) =>
    new Promise((resolve, reject) => {
      db.query('UPDATE recipe SET is_active=0 WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  unbannedById: (id) =>
    new Promise((resolve, reject) => {
      db.query('UPDATE recipe SET is_active=1 WHERE id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectAllRecipeByUser: (id) =>
    new Promise((resolve, reject) => {
      db.query('SELECT recipe.id, recipe.title, recipe.ingredients, recipe.photo, recipe.date, recipe.is_active, recipe.user_id, users.name, users.email, users.phone FROM recipe INNER JOIN users ON users.id = recipe.user_id WHERE user_id=$1', [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectLatest: () =>
    new Promise((resolve, reject) => {
      db.query('SELECT id, title, photo FROM recipe INNER JOIN users ON recipe.user_id=users.id ORDER BY date DESC LIMIT 5', (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  countAll: () =>
    new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) FROM recipe', (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
};
