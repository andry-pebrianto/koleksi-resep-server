const recipeModel = require("../models/recipe.model");
const commentModel = require("../models/comment.model");
const { success, failed } = require("../utils/createResponse");

module.exports = {
  insert: async (req, res) => {
    try {
      const { recipeId, commentText } = req.body;

      const recipe = await recipeModel.selectById(recipeId);
      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        failed(res, {
          code: 404,
          payload: `Recipe with Id ${recipeId} not found`,
          message: "Insert Comment Failed",
        });
        return;
      }

      await commentModel.store({
        recipeId,
        commentText,
        userId: req.APP_DATA.tokenDecoded.id,
      });

      success(res, {
        code: 201,
        payload: null,
        message: "Insert Comment Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;

      const comment = await commentModel.selectById(id);
      // jika comment tidak ditemukan
      if (!comment.rowCount) {
        failed(res, {
          code: 404,
          payload: `Comment with Id ${id} not found`,
          message: "Update Comment Failed",
        });
        return;
      }
      await commentModel.updateById(id, req.body);

      success(res, {
        code: 200,
        payload: null,
        message: "Update Comment Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await commentModel.selectById(id);

      // jika comment tidak ditemukan
      if (!comment.rowCount) {
        failed(res, {
          code: 404,
          payload: `Comment with Id ${id} not found`,
          message: "Delete Comment Failed",
        });
        return;
      }
      await commentModel.removeById(id);

      success(res, {
        code: 200,
        payload: null,
        message: "Delete Comment Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
};
