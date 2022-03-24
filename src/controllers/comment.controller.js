const createError = require('http-errors');
const commentModel = require('../models/comment.model');

module.exports = {
  list: async (req, res, next) => {
    try {
      const comments = await commentModel.selectAll();

      res.json(comments.rows);
    } catch (error) {
      next(error);
    }
  },
  detail: async (req, res, next) => {
    const { id } = req.params;

    try {
      const recipe = await commentModel.selectById(id);

      // jika recipe tidak ditemukan
      if (!recipe.rows.length) {
        next(createError(404, 'No recipe found'));
        return;
      }

      res.json(recipe.rows[0]);
    } catch (error) {
      next(error);
    }
  },
  insert: async (req, res, next) => {
    const { body } = req;

    try {
      await commentModel.store({ ...body, date: new Date() });

      res.status(201).json({
        message: 'Insert data recipe success',
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    try {
      // mengecek recipe apakah ada
      const recipe = await commentModel.selectById(id);
      if (!recipe.rows[0]) {
        next(createError(404, 'No recipe found'));
      }
      await commentModel.updateById(id, body);

      res.json({
        message: 'Update data recipe success',
      });
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    const { id } = req.params;

    try {
      // mengecek recipe apakah ada
      const recipe = await commentModel.selectById(id);
      if (!recipe.rows[0]) {
        next(createError(404, 'No recipe found'));
      }
      await commentModel.removeById(id);

      res.json({
        message: 'Delete data recipe success',
      });
    } catch (error) {
      next(error);
    }
  },
};
