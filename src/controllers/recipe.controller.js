const recipeModel = require("../models/recipe.model");
const tagModel = require("../models/tag.model");
const { success, failed } = require("../utils/createResponse");
const createPagination = require("../utils/createPagination");

module.exports = {
  list: async (req, res) => {
    try {
      const { search, page, limit, sort } = req.query;
      const count = await recipeModel.countAll(search);
      const paging = createPagination(count.rows[0].count, page, limit);
      const recipes = await recipeModel.selectAll(
        req.APP_DATA.tokenDecoded.level,
        paging,
        search,
        sort
      );

      success(res, {
        code: 200,
        payload: recipes.rows,
        pagination: paging.response,
        message: "Select List Recipe Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  detail: async (req, res) => {
    try {
      const { id } = req.params;
      const recipe = await recipeModel.selectById(id);
      const tags = await tagModel.selectByRecipeId(id);

      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        failed(res, {
          code: 404,
          payload: `Recipe with Id ${id} not found`,
          message: "Select Detail Recipe Failed",
        });
        return;
      }

      success(res, {
        code: 200,
        payload: {
          ...recipe.rows[0],
          tags: tags.rows.map((tag) => tag.name),
        },
        message: "Select Detail Recipe Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  insert: async (req, res) => {
    try {
      const { title, ingredients, photoUrl, videoUrl, tags } = req.body;

      // insert tags (not if already exist)
      await tagModel.insert(tags);

      // insert recipe
      const recipe = await recipeModel.store({
        userId: req.APP_DATA.tokenDecoded.id,
        title,
        ingredients,
        photoUrl,
        videoUrl,
      });

      // insert junk recipes & tags
      const tagsAfter = await tagModel.selectAll();
      const tagsJunk = tagsAfter.rows
        .filter((tagAfter) => tags.includes(tagAfter.name))
        .map((tagJunk) => tagJunk.id);
      await tagModel.insertJunk(recipe.rows[0].id, tagsJunk);

      success(res, {
        code: 201,
        payload: null,
        message: "Insert Recipe Success",
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
      const { title, ingredients, photoUrl, videoUrl, tags } = req.body;

      // insert tags (not if already exist)
      await tagModel.insert(tags);

      const recipe = await recipeModel.selectById(id);
      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        failed(res, {
          code: 404,
          payload: `Recipe with Id ${id} not found`,
          message: "Update Recipe Failed",
        });
        return;
      }

      await recipeModel.updateById(id, {
        title,
        ingredients,
        photoUrl,
        videoUrl,
      });

      // delete all old junk
      await tagModel.deleteJunkByRecipeId(id);
      // insert new junk
      const tagsAfter = await tagModel.selectAll();
      const tagsJunk = tagsAfter.rows
        .filter((tagAfter) => tags.includes(tagAfter.name))
        .map((tagJunk) => tagJunk.id);
      await tagModel.insertJunk(recipe.rows[0].id, tagsJunk);

      success(res, {
        code: 200,
        payload: null,
        message: "Update Recipe Success",
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
      const recipe = await recipeModel.selectById(id);

      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        failed(res, {
          code: 404,
          payload: `Recipe with Id ${id} not found`,
          message: "Delete Recipe Failed",
        });
        return;
      }
      await tagModel.deleteJunkByRecipeId(id);
      await recipeModel.removeById(id);

      success(res, {
        code: 200,
        payload: null,
        message: "Delete Recipe Success",
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
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
          message: "Banned Recipe Failed",
        });
        return;
      }
      const banned = recipe.rows[0].is_active ? 0 : 1;
      await recipeModel.bannedById(id, banned);

      success(res, {
        code: 200,
        payload: null,
        message: `${
          recipe.rows[0].is_active ? "Banned" : "Unbanned"
        } Recipe Success`,
      });
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  latest: async (req, res) => {
    try {
      const latestRecipe = await recipeModel.selectLatest();

      success(res, {
        code: 200,
        payload: latestRecipe.rows,
        message: "Select Latest Recipe Success",
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
