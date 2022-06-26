const bcrypt = require('bcrypt');
const authModel = require('../models/auth.model');
const userModel = require('../models/user.model');
const recipeModel = require('../models/recipe.model');
const { success, failed } = require('../utils/createResponse');
const createPagination = require('../utils/createPagination');
const deleteFile = require('../utils/deleteFile');

module.exports = {
  list: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const count = await userModel.countAll();
      const paging = createPagination(count.rows[0].count, page, limit);
      const users = await userModel.selectAll(
        req.APP_DATA.tokenDecoded.level,
        paging,
      );

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
        // menghapus photo jika ada
        if (req.files) {
          if (req.files.photo) {
            deleteFile(req.files.photo[0].path);
          }
        }

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
          // menghapus photo lama
          if (user.rows[0].photo !== 'profile-default.jpg') {
            deleteFile(`public/photo/${user.rows[0].photo}`);
          }
          // mendapatkan name photo baru
          photo = req.files.photo[0].filename;
        }
      }
      const { email } = user.rows[0]; // email tidak boleh diubah
      await userModel.updateById(id, { ...req.body, photo, email });

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
  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await userModel.selectById(id);
      // jika user tidak ditemukan
      if (!user.rowCount) {
        // menghapus photo jika ada
        if (req.files) {
          if (req.files.photo) {
            deleteFile(req.files.photo[0].path);
          }
        }

        failed(res, {
          code: 404,
          payload: `User with Id ${id} not found`,
          message: 'Update Password Failed',
        });
        return;
      }

      // jika password lama salah
      const match = await bcrypt.compare(
        req.body.oldPassword,
        user.rows[0].password,
      );
      if (!match) {
        failed(res, {
          code: 401,
          payload: 'Old password wrong',
          message: 'Update Password Failed',
        });
        return;
      }

      const password = await bcrypt.hash(req.body.password, 10);
      await authModel.resetPassword(user.rows[0].id, password);

      success(res, {
        code: 200,
        payload: null,
        message: 'Update Password Success',
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

      // menghapus photo jika ada
      if (user.rows[0].photo !== 'profile-default.jpg') {
        deleteFile(`public/photo/${user.rows[0].photo}`);
      }

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
      const banned = user.rows[0].is_active ? 0 : 1;
      await userModel.bannedById(id, banned);

      success(res, {
        code: 200,
        payload: null,
        message: `${
          user.rows[0].is_active ? 'Banned' : 'Unbanned'
        } User Success`,
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
