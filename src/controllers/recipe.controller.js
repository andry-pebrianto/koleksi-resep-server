const recipeModel = require('../models/recipe.model');
const commentModel = require('../models/comment.model');
const recipeValidation = require('../validations/recipe.validation');
const createResponse = require('../utils/createResponse');
const createPagination = require('../utils/createPagination');

module.exports = {
  list: async (req, res) => {
    try {
      const { search, page, limit } = req.query;
      const count = await recipeModel.countAll();
      const paging = createPagination(count.rows[0].count, page, limit);
      const recipes = await recipeModel.selectAll(paging, search);

      createResponse.success(res, {
        code: 200,
        payload: recipes.rows,
        message: 'Select list recipe success',
        pagination: paging.response,
      });
    } catch (error) {
      createResponse.failed(res, {
        code: 500,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
  detail: async (req, res) => {
    try {
      const { id } = req.params;
      const recipe = await recipeModel.selectById(id);

      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        createResponse.failed(res, {
          code: 404,
          payload: 'Recipe with that id not found',
          message: 'Select detail recipe failed',
        });
        return;
      }

      createResponse.success(res, {
        code: 200,
        payload: recipe.rows[0],
        message: 'Select detail recipe success',
      });
    } catch (error) {
      createResponse.failed(res, {
        code: 500,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
  insert: async (req, res) => {
    try {
      const { bad, message, body } = recipeValidation.insertValidation(
        req.body,
      );

      // jika ada error saat validasi
      if (bad) {
        res.status(400).json({
          status: 400,
          message,
        });
        return;
      }
      await recipeModel.store({ ...body, date: new Date() });

      createResponse.success(res, {
        code: 201,
        payload: null,
        message: 'Insert recipe data success',
      });
    } catch (error) {
      createResponse.failed(res, {
        code: 500,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { bad, message, body } = recipeValidation.insertValidation(
        req.body,
      );

      // jika ada error saat validasi
      if (bad) {
        res.status(400).json({
          status: 400,
          message,
        });
        return;
      }

      const recipe = await recipeModel.selectById(id);
      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        createResponse.failed(res, {
          code: 404,
          payload: 'Recipe with that id not found',
          message: 'Update recipe data failed',
        });
        return;
      }
      await recipeModel.updateById(id, body);

      createResponse.success(res, {
        code: 200,
        payload: null,
        message: 'Update recipe data success',
      });
    } catch (error) {
      createResponse.failed(res, {
        code: 500,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const recipe = await recipeModel.selectById(id);

      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        createResponse.failed(res, {
          code: 404,
          payload: 'Recipe with that id not found',
          message: 'Delete recipe data failed',
        });
        return;
      }
      await recipeModel.removeById(id);

      createResponse.success(res, {
        code: 200,
        payload: null,
        message: 'Delete recipe data success',
      });
    } catch (error) {
      createResponse.failed(res, {
        code: 500,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
  listComment: async (req, res) => {
    try {
      const { id } = req.params;
      const recipeComments = await commentModel.selectAllCommentByRecipe(id);

      createResponse.success(res, {
        code: 200,
        payload: recipeComments.rows,
        message: 'Select list comment by recipe success',
      });
    } catch (error) {
      createResponse.failed(res, {
        code: 500,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
  latest: async (req, res) => {
    try {
      const latestRecipe = await recipeModel.selectLatest();

      createResponse.success(res, {
        code: 200,
        payload: latestRecipe.rows,
        message: 'Select latest recipe success',
      });
    } catch (error) {
      createResponse.failed(res, {
        code: 500,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
};
