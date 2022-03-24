const recipeModel = require('../models/recipe.model');

module.exports = {
  list: async (req, res) => {
    try {
      const recipes = await recipeModel.selectAll();

      res.json(recipes.rows);
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
  detail: async (req, res) => {
    const { id } = req.params;

    try {
      const recipe = await recipeModel.selectById(id);

      // jika recipe tidak ditemukan
      if (!recipe.rows.length) {
        res.json({});
        return;
      }

      res.json(recipe.rows[0]);
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
  insert: async (req, res) => {
    const { body } = req;

    try {
      await recipeModel.store({ ...body, date: new Date() });

      res.status(201).json({
        message: 'Insert data recipe success',
      });
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    try {
      // mengecek recipe apakah ada
      const recipe = await recipeModel.selectById(id);
      if (!recipe.rows[0]) {
        res.status(404).json({
          error: {
            status: 404,
            message: 'Recipe with that Id not found',
          },
        });
        return;
      }
      await recipeModel.updateById(id, body);

      res.json({
        message: 'Update data recipe success',
      });
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
  remove: async (req, res) => {
    const { id } = req.params;

    try {
      // mengecek recipe apakah ada
      const recipe = await recipeModel.selectById(id);
      if (!recipe.rows[0]) {
        res.status(404).json({
          error: {
            status: 404,
            message: 'User with that Id not found',
          },
        });
        return;
      }
      await recipeModel.removeById(id);

      res.json({
        message: 'Delete data recipe success',
      });
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
};
