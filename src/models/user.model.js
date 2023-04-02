const db = require("../config/db");

module.exports = {
  selectAll: (level, { paging, search }) =>
    new Promise((resolve, reject) => {
      let query =
        "SELECT * FROM users WHERE LOWER(full_name) LIKE '%'||LOWER($1)||'%'";

      if (level === 2) {
        query += " AND is_active=1";
      }

      query += ` LIMIT ${paging.limit} OFFSET ${paging.offset}`;

      db.query(query, [search || ""], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectById: (id) =>
    new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE id=$1", [id], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
  selectByEmail: (email) =>
    new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email=$1",
        [email],
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
      const { fullName, phone, birthDate, photo } = body;
      const updatedAt = new Date();

      db.query(
        "UPDATE users SET full_name=$1, phone=$2, birth_date=$3, photo_url=$4, updated_at=$5 WHERE id=$6",
        [fullName, phone, birthDate, photo, updatedAt, id],
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
      db.query(
        "UPDATE users SET is_active=0 WHERE id=$1",
        [id],
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        }
      );
    }),
  bannedById: (id, banned) =>
    new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET is_active=$1 WHERE id=$2",
        [banned, id],
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
      db.query("SELECT COUNT(*) FROM users", (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }),
};
