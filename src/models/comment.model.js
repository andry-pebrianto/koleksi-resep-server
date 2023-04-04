const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

module.exports = {
  selectById: (id) =>
    new Promise((resolve, reject) => {
      db.query("SELECT * FROM comments WHERE id=$1", [id], (error, result) => {
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
        "INSERT INTO comments (id, recipe_id, body, user_id) VALUES ($1, $2, $3, $4)",
        [uuidv4(), recipeId, commentText, userId],
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
      const { commentText } = body;
      const updatedAt = new Date();

      db.query(
        "UPDATE comments SET body=$1, updated_at=$2 WHERE id=$3",
        [commentText, updatedAt, id],
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
      db.query("DELETE FROM comments WHERE id=$1", [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectAllCommentByRecipe: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT comments.id, comments.body, comments.user_id, comments.recipe_id, users.full_name, users.photo_url FROM comments INNER JOIN users ON comments.user_id = users.id WHERE recipe_id=$1",
        [id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  countAll: () =>
    new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) FROM comments", (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
};
