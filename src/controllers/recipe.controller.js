const recipeModel = require('../models/recipe.model');
const commentModel = require('../models/comment.model');
const recipeValidation = require('../validations/recipe.validation');
const createPagination = require('../utils/createPagination');

module.exports = {
  list: async (req, res) => {
    const { search, page, limit } = req.query;
    const paging = createPagination(page, limit);

    try {
      const recipes = await recipeModel.selectAll(paging, search);

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
    const { bad, message, body } = recipeValidation.insertValidation(req.body);

    // jika ada error saat validasi
    if (bad) {
      res.status(400).json({
        status: 400,
        message,
      });
      return;
    }

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
    const { bad, message, body } = recipeValidation.insertValidation(req.body);

    // jika ada error saat validasi
    if (bad) {
      res.status(400).json({
        status: 400,
        message,
      });
      return;
    }

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
  listComment: async (req, res) => {
    const { id } = req.params;

    try {
      const recipeComments = await commentModel.selectAllCommentByRecipe(id);

      res.json(recipeComments.rows);
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
  latest: async (req, res) => {
    try {
      const latestRecipe = await recipeModel.selectLatest();

      res.json(latestRecipe.rows);
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
