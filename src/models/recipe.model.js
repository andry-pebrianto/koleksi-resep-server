const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

module.exports = {
  selectAll: (level, paging, search = "", sort = "date") =>
    new Promise((resolve, reject) => {
      let sql = `SELECT r.*, users.full_name, array_agg(tags.name) AS tags FROM recipes r
      JOIN users ON r.user_id = users.id
      JOIN recipe_tags ON r.id = recipe_tags.recipe_id
      JOIN tags ON recipe_tags.tag_id = tags.id
      WHERE LOWER(title) LIKE '%'||LOWER($1)||'%' ${
        level === 2 ? "AND r.is_active=1" : ""
      } GROUP BY r.id, users.full_name`;
      if (sort.trim() === "title") {
        sql += " ORDER BY title";
      } else {
        sql += " ORDER BY created_at";
      }
      sql += ` LIMIT ${paging.limit} OFFSET ${paging.offset}`;

      db.query(sql, [search.trim()], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectById: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT recipes.id, recipes.title, recipes.ingredients, recipes.photo_url, recipes.video_url, recipes.created_at, recipes.updated_at, recipes.is_active, recipes.user_id, users.full_name FROM recipes INNER JOIN users ON users.id = recipes.user_id WHERE recipes.id=$1",
        [id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  store: (body) =>
    new Promise((resolve, reject) => {
      const { userId, title, ingredients, photoUrl, videoUrl } = body;

      db.query(
        "INSERT INTO recipes (id, user_id, title, ingredients, video_url, photo_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [uuidv4(), userId, title, ingredients, videoUrl, photoUrl],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  updateById: (id, body) =>
    new Promise((resolve, reject) => {
      const { title, ingredients, photoUrl, videoUrl } = body;

      db.query(
        "UPDATE recipes SET title=$1, ingredients=$2, video_url=$3, photo_url=$4 WHERE id=$5",
        [title, ingredients, videoUrl, photoUrl, id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  removeById: (id) =>
    new Promise((resolve, reject) => {
      db.query("DELETE FROM recipes WHERE id=$1", [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  bannedById: (id, banned) =>
    new Promise((resolve, reject) => {
      db.query(
        "UPDATE recipes SET is_active=$1 WHERE id=$2",
        [banned, id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  selectAllRecipeByUser: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT recipes.id, recipes.title, recipes.ingredients, recipes.photo_url, recipes.created_at, recipes.updated_at, recipes.is_active, recipes.user_id, users.full_name, users.email, users.phone FROM recipes INNER JOIN users ON users.id = recipes.user_id WHERE user_id=$1",
        [id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  selectLatest: () =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT recipes.id, recipes.title, recipes.photo_url, recipes.created_at, users.full_name FROM recipes INNER JOIN users ON recipes.user_id=users.id ORDER BY created_at DESC LIMIT 6",
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  countAll: (search = "") =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) FROM recipes WHERE LOWER(title) LIKE '%'||LOWER($1)||'%'",
        [search.trim()],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
};
