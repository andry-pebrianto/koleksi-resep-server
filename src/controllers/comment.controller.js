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
      const comment = await commentModel.selectById(id);

      // jika comment tidak ditemukan
      if (!comment.rows.length) {
        next(createError(404, 'No comment found'));
        return;
      }

      res.json(comment.rows[0]);
    } catch (error) {
      next(error);
    }
  },
  insert: async (req, res, next) => {
    const { body } = req;

    try {
      await commentModel.store(body);

      res.status(201).json({
        message: 'Insert data comment success',
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    try {
      // mengecek comment apakah ada
      const comment = await commentModel.selectById(id);
      if (!comment.rows[0]) {
        next(createError(404, 'No comment found'));
      }
      await commentModel.updateById(id, body);

      res.json({
        message: 'Update data comment success',
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
