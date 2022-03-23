const createError = require('http-errors');
const userModel = require('../models/user.model');

module.exports = {
  list: async (req, res, next) => {
    try {
      const users = await userModel.selectAll();

      res.json(users.rows);
    } catch (error) {
      next(error);
    }
  },
  detail: async (req, res, next) => {
    const { id } = req.params;

    try {
      const user = await userModel.selectById(id);

      // jika user tidak ditemukan
      if (!user.rows.length) {
        next(createError(404, 'No user found'));
      }

      res.json(user.rows[0]);
    } catch (error) {
      next(error);
    }
  },
  insert: async (req, res, next) => {
    const { body } = req;

    try {
      await userModel.store(body);

      res.status(201).json({
        message: 'Insert data success',
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    try {
      // mengecek user apakah ada
      const user = await userModel.selectById(id);
      if (!user.rows[0]) {
        next(createError(404, 'No user found'));
      }
      await userModel.updateById({ ...body, id });

      res.json({
        message: 'Update data success',
      });
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    const { id } = req.params;

    try {
      // mengecek user apakah ada
      const user = await userModel.selectById(id);
      if (!user.rows[0]) {
        next(createError(404, 'No user found'));
      }
      await userModel.removeById(id);

      res.json({
        message: 'Delete data success',
      });
    } catch (error) {
      next(error);
    }
  },
};
