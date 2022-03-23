const db = require("../config/db");

module.exports = {
  selectAll: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM userss", (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },
};
