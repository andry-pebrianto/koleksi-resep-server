const { v4: uuidv4 } = require('uuid');
const recipeModel = require('../models/recipe.model');
const commentModel = require('../models/comment.model');
const recipeValidation = require('../validations/recipe.validation');
const { success, failed } = require('../utils/createResponse');
const createPagination = require('../utils/createPagination');

module.exports = {
  list: async (req, res) => {
    try {
      const { search, page, limit } = req.query;
      const count = await recipeModel.countAll();
      const paging = createPagination(count.rows[0].count, page, limit);
      const recipes = await recipeModel.selectAll(paging, search);

      success(res, {
        code: 200,
        payload: recipes.rows,
        pagination: paging.response,
        message: 'Select List Recipe Success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  detail: async (req, res) => {
    try {
      const { id } = req.params;
      const recipe = await recipeModel.selectById(id);

      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        failed(res, {
          code: 404,
          payload: `Recipe with Id ${id} not found`,
          message: 'Select Detail Recipe Failed',
        });
        return;
      }

      success(res, {
        code: 200,
        payload: recipe.rows[0],
        message: 'Select Detail Recipe Success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  insert: async (req, res) => {
    try {
      let photo = '';
      let video = '';

      // jika recipe disertai photo dan/atau video
      if(req.files) {
        if(req.files.photo) {
          photo = req.files.photo[0].filename;
        }
        if(req.files.video) {
          video = req.files.video[0].filename;
        }
      }

      await recipeModel.store({ id: uuidv4(), ...req.body, photo, video, date: new Date() });

      success(res, {
        code: 201,
        payload: null,
        message: 'Insert Recipe Success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
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
        failed(res, {
          code: 404,
          payload: 'Recipe with that id not found',
          message: 'Update recipe data failed',
        });
        return;
      }
      await recipeModel.updateById(id, body);

      success(res, {
        code: 200,
        payload: null,
        message: 'Update recipe data success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const recipe = await recipeModel.selectById(id);

      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        failed(res, {
          code: 404,
          payload: 'Recipe with that id not found',
          message: 'Delete recipe data failed',
        });
        return;
      }
      await recipeModel.removeById(id);

      success(res, {
        code: 200,
        payload: null,
        message: 'Delete recipe data success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  listComment: async (req, res) => {
    try {
      const { id } = req.params;
      const recipeComments = await commentModel.selectAllCommentByRecipe(id);

      success(res, {
        code: 200,
        payload: recipeComments.rows,
        message: 'Select list comment by recipe success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  latest: async (req, res) => {
    try {
      const latestRecipe = await recipeModel.selectLatest();

      success(res, {
        code: 200,
        payload: latestRecipe.rows,
        message: 'Select latest recipe success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
};
