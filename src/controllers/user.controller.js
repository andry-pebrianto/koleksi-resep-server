const { selectAll } = require("../models/user.model.js");

module.exports = {
  list: async (req, res, next) => {
    try {
      const data = await selectAll();

      res.json(data.rows);
    } catch (err) {
      next(err);
    }
  },
  detail: async (req, res) => {},
  insert: async (req, res) => {},
  update: async (req, res) => {},
  remove: async (req, res) => {},
};
