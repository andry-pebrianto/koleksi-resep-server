const { selectAll } = require("../models/user.model.js");

module.exports = {
  list: async (req, res) => {
    try {
      const data = await selectAll();

      res.json(data.rows);
    } catch (error) {
      res.json(error.message);
    }
  },
  detail: async (req, res) => {},
  insert: async (req, res) => {},
  update: async (req, res) => {},
  remove: async (req, res) => {},
};
