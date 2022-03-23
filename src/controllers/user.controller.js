const createError = require("http-errors");
const {
  selectAll,
  selectById,
  store,
  update,
  remove,
} = require("../models/user.model.js");

module.exports = {
  list: async (req, res, next) => {
    try {
      const data = await selectAll();

      res.json(data.rows);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  detail: async (req, res, next) => {
    const { id } = req.params;

    try {
      const data = await selectById(id);

      // jika user tidak ditemukan
      if (!data.rows.length) {
        next(createError(404, "No user found"));
      }

      res.json(data.rows[0]);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  insert: async (req, res, next) => {
    const body = req.body;

    try {
      await store(body);

      res.status(201).json({
        message: "Insert data success",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;

    try {
      await update({ ...body, id });

      res.status(201).json({
        message: "Update data success",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  remove: async (req, res, next) => {
    const { id } = req.params;

    try {
      await remove(id);

      res.status(201).json({
        message: "Delete data success",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
