const { v4: uuidv4 } = require('uuid');
const recipeModel = require('../models/recipe.model');
const commentModel = require('../models/comment.model');
const { success, failed } = require('../utils/createResponse');
const createPagination = require('../utils/createPagination');
const uploadGoogleDrive = require('../utils/uploadGoogleDrive');
const deleteGoogleDrive = require('../utils/deleteGoogleDrive');
const deleteFile = require('../utils/deleteFile');

module.exports = {
  list: async (req, res) => {
    try {
      const { search, page, limit } = req.query;
      const count = await recipeModel.countAll();
      const paging = createPagination(count.rows[0].count, page, limit);
      const recipes = await recipeModel.selectAll(req.APP_DATA.tokenDecoded.level, paging, search);

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
      if (req.files) {
        // jika recipe disertai photo
        if (req.files.photo) {
          photo = req.files.photo[0].filename;
        }
        // jika recipe disertai video
        if (req.files.video) {
          // mengupload video baru ke gd
          video = await uploadGoogleDrive(req.files.video[0]);
          // menghapus video setelah diupload ke gd
          deleteFile(req.files.video[0].path);
        }
      }

      await recipeModel.store({
        id: uuidv4(),
        ...req.body,
        userId: req.APP_DATA.tokenDecoded.id,
        photo,
        videoId: typeof video === 'object' ? video.id : '',
        video: typeof video === 'object' ? video.gdLink : video,
        date: new Date(),
      });

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

      const recipe = await recipeModel.selectById(id);
      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        failed(res, {
          code: 404,
          payload: `Recipe with Id ${id} not found`,
          message: 'Update Recipe Failed',
        });
        return;
      }

      // jika update recipe disertai photo
      let { photo, video } = recipe.rows[0];
      if (req.files) {
        if (req.files.photo) {
          // menghapus photo lama
          deleteFile(`public/photo/${recipe.rows[0].photo}`);
          photo = req.files.photo[0].filename;
        }
        if (req.files.video) {
          // menghapus video sebelumnya di gd
          await deleteGoogleDrive(recipe.rows[0].video_id);
          // upload video baru ke gd
          video = await uploadGoogleDrive(req.files.video[0]);
          // menghapus video setelah diupload ke gd
          deleteFile(req.files.video[0].path);
        }
      }
      await recipeModel.updateById(id, {
        ...req.body,
        photo,
        videoId: typeof video === 'object' ? video.id : '',
        video: typeof video === 'object' ? video.gdLink : video,
      });

      success(res, {
        code: 200,
        payload: null,
        message: 'Update Recipe Success',
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
          payload: `Recipe with Id ${id} not found`,
          message: 'Delete Recipe Failed',
        });
        return;
      }
      await recipeModel.removeById(id);

      // menghapus photo jika ada
      deleteFile(`public/photo/${recipe.rows[0].photo}`);
      // menghapus video dari gd jika ada
      if (recipe.rows[0].video) {
        await deleteGoogleDrive(recipe.rows[0].video_id);
      }

      success(res, {
        code: 200,
        payload: null,
        message: 'Delete Recipe Success',
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
      const recipe = await recipeModel.selectById(id);

      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        failed(res, {
          code: 404,
          payload: `Recipe with Id ${id} not found`,
          message: 'Banned Recipe Failed',
        });
        return;
      }
      await recipeModel.bannedById(id);

      success(res, {
        code: 200,
        payload: null,
        message: 'Banned Recipe Success',
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
      const recipe = await recipeModel.selectById(id);

      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        failed(res, {
          code: 404,
          payload: `Recipe with Id ${id} not found`,
          message: 'Unbanned Recipe Failed',
        });
        return;
      }
      await recipeModel.unbannedById(id);

      success(res, {
        code: 200,
        payload: null,
        message: 'Unbanned Recipe Success',
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
        message: 'Select Latest Recipe Success',
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
