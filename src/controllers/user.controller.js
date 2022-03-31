const userModel = require('../models/user.model');
const recipeModel = require('../models/recipe.model');
const userValidation = require('../validations/user.validation');
const createResponse = require('../utils/createResponse');
const createPagination = require('../utils/createPagination');

module.exports = {
  list: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const count = await userModel.countAll();
      const paging = createPagination(count.rows[0].count, page, limit);
      const users = await userModel.selectAll(paging);

      createResponse.success(res, {
        code: 200,
        payload: users.rows,
        message: 'Select list user success',
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
      const user = await userModel.selectById(id);

      // jika user tidak ditemukan
      if (!user.rowCount) {
        createResponse.failed(res, {
          code: 404,
          payload: 'User with that id not found',
          message: 'Select detail user failed',
        });
        return;
      }

      createResponse.success(res, {
        code: 200,
        payload: user.rows[0],
        message: 'Select detail user success',
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
      const { bad, message, body } = userValidation.insertValidation(req.body);

      // jika ada error saat validasi
      if (bad) {
        res.status(400).json({
          status: 400,
          message,
        });
        return;
      }
      await userModel.store(body);

      createResponse.success(res, {
        code: 201,
        payload: null,
        message: 'Insert user data success',
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
      const { bad, message, body } = userValidation.insertValidation(req.body);

      // jika ada error saat validasi
      if (bad) {
        res.status(400).json({
          status: 400,
          message,
        });
        return;
      }

      const user = await userModel.selectById(id);
      // jika user tidak ditemukan
      if (!user.rowCount) {
        createResponse.failed(res, {
          code: 404,
          payload: 'User with that id not found',
          message: 'Update user data failed',
        });
        return;
      }
      await userModel.updateById(id, body);

      createResponse.success(res, {
        code: 200,
        payload: null,
        message: 'Update user data success',
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
      const user = await userModel.selectById(id);

      // jika user tidak ditemukan
      if (!user.rowCount) {
        createResponse.failed(res, {
          code: 404,
          payload: 'User with that id not found',
          message: 'Delete user data failed',
        });
        return;
      }
      await userModel.removeById(id);

      createResponse.success(res, {
        code: 200,
        payload: null,
        message: 'Delete user data success',
      });
    } catch (error) {
      createResponse.failed(res, {
        code: 500,
        payload: error.message,
        message: 'Something wrong on server',
      });
    }
  },
  listRecipe: async (req, res) => {
    const { id } = req.params;

    try {
      const userRecipes = await recipeModel.selectAllRecipeByUser(id);

      createResponse.success(res, {
        code: 200,
        payload: userRecipes.rows,
        message: 'Select list recipe by user success',
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
