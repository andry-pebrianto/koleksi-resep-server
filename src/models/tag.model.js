const pgp = require("pg-promise")();
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db"); // pg
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} = require("../utils/env");

// pg-promise
const dbP = pgp({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});

module.exports = {
  insert: (tags) =>
    new Promise((resolve, reject) => {
      const tagsInsert = tags.map((tag) => ({
        id: uuidv4(),
        name: tag.toLowerCase(),
      }));

      const cs = new pgp.helpers.ColumnSet(["id", "name"], {
        table: "tags",
      });

      const query =
        pgp.helpers.insert(tagsInsert, cs) +
        " ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name";

      dbP
        .none(query)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    }),
  insertJunk: (id, tags) =>
    new Promise((resolve, reject) => {
      const recipeTagsInsert = tags.map((tag) => ({
        id: uuidv4(),
        recipe_id: id,
        tag_id: tag,
      }));

      const cs = new pgp.helpers.ColumnSet(["id", "recipe_id", "tag_id"], {
        table: "recipe_tags",
      });

      const query = pgp.helpers.insert(recipeTagsInsert, cs);

      dbP
        .none(query)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    }),
  selectAll: () =>
    new Promise((resolve, reject) => {
      db.query("SELECT * FROM tags", (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectByRecipeId: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT tags.name FROM tags JOIN recipe_tags ON recipe_tags.tag_id = tags.id WHERE recipe_tags.recipe_id=$1",
        [id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  deleteJunkByRecipeId: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM recipe_tags WHERE recipe_id=$1",
        [id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
};
