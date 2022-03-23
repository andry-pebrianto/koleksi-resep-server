const { selectAll, selectById } = require("../models/user.model.js");

module.exports = {
  list: async (req, res, next) => {
    try {
      const data = await selectAll();

      res.json(data.rows);
    } catch (error) {
      next(error);
    }
  },
  detail: async (req, res, next) => {
    const { id } = req.params;

    try {
      const data = await selectById(id);

      res.json(data.rows[0]);
    } catch (error) {
      next(error);
    }
  },
  insert: async (req, res) => {},
  update: async (req, res) => {},
  remove: async (req, res) => {},
};
