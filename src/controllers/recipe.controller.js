const createError = require('http-errors');
const recipeModel = require('../models/recipe.model');

module.exports = {
  list: async (req, res, next) => {
    try {
      const recipes = await recipeModel.selectAll();

      res.json(recipes.rows);
    } catch (error) {
      next(error);
    }
  },
  detail: async (req, res, next) => {
    const { id } = req.params;

    try {
      const user = await recipeModel.selectById(id);

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
      await recipeModel.store(body);

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
      const user = await recipeModel.selectById(id);
      if (!user.rows[0]) {
        next(createError(404, 'No user found'));
      }
      await recipeModel.updateById({ ...body, id });

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
      const user = await recipeModel.selectById(id);
      if (!user.rows[0]) {
        next(createError(404, 'No user found'));
      }
      await recipeModel.removeById(id);

      res.json({
        message: 'Delete data success',
      });
    } catch (error) {
      next(error);
    }
  },
};
