const userModel = require('../models/user.model');
const recipeModel = require('../models/recipe.model');
const { success, failed } = require('../utils/createResponse');
const createPagination = require('../utils/createPagination');

module.exports = {
  list: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const count = await userModel.countAll();
      const paging = createPagination(count.rows[0].count, page, limit);
      const users = await userModel.selectAll(req.APP_DATA.tokenDecoded.level, paging);

      success(res, {
        code: 200,
        payload: users.rows,
        message: 'Select List User Success',
        pagination: paging.response,
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
      const user = await userModel.selectById(id);

      // jika user tidak ditemukan
      if (!user.rowCount) {
        failed(res, {
          code: 404,
          payload: `User with Id ${id} not found`,
          message: 'Select Detail User Failed',
        });
        return;
      }

      success(res, {
        code: 200,
        payload: user.rows[0],
        message: 'Select Detail User Success',
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

      const user = await userModel.selectById(id);
      // jika user tidak ditemukan
      if (!user.rowCount) {
        failed(res, {
          code: 404,
          payload: `User with Id ${id} not found`,
          message: 'Update User Failed',
        });
        return;
      }

      // jika update user disertai photo
      let { photo } = user.rows[0];
      if (req.files) {
        if (req.files.photo) {
          photo = req.files.photo[0].filename;
        }
      }
      await userModel.updateById(id, { ...req.body, photo });

      success(res, {
        code: 200,
        payload: null,
        message: 'Update User Success',
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
      const user = await userModel.selectById(id);

      // jika user tidak ditemukan
      if (!user.rowCount) {
        failed(res, {
          code: 404,
          payload: `User with Id ${id} not found`,
          message: 'Delete User Failed',
        });
        return;
      }
      await userModel.removeById(id);

      success(res, {
        code: 200,
        payload: null,
        message: 'Delete User Success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  banned: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userModel.selectById(id);

      // jika user tidak ditemukan
      if (!user.rowCount) {
        failed(res, {
          code: 404,
          payload: `User with Id ${id} not found`,
          message: 'Banned User Failed',
        });
        return;
      }
      await userModel.bannedById(id);

      success(res, {
        code: 200,
        payload: null,
        message: 'Banned User Success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  unbanned: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userModel.selectById(id);

      // jika user tidak ditemukan
      if (!user.rowCount) {
        failed(res, {
          code: 404,
          payload: `User with Id ${id} not found`,
          message: 'Unbanned User Failed',
        });
        return;
      }
      await userModel.unbannedById(id);

      success(res, {
        code: 200,
        payload: null,
        message: 'Unbanned User Success',
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  listRecipe: async (req, res) => {
    const { id } = req.params;

    try {
      const userRecipes = await recipeModel.selectAllRecipeByUser(id);

      success(res, {
        code: 200,
        payload: userRecipes.rows,
        message: 'Select list recipe by user success',
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
