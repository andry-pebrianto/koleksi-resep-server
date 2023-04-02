const userModel = require("../models/user.model");
const recipeModel = require("../models/recipe.model");
const commentModel = require("../models/comment.model");
const { failed } = require("../utils/createResponse");

module.exports = {
  // checked
  isVerified: async (req, res, next) => {
    try {
      const user = await userModel.selectByEmail(req.body.email);

      if (!user.rowCount) {
        next();
      } else if (user.rows[0].is_verified === 1) {
        next();
      } else {
        failed(res, {
          code: 401,
          payload: "Your email is not verified yet",
          message: "Unauthorized",
        });
      }
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  // checked
  onlyAdmin: async (req, res, next) => {
    try {
      const user = await userModel.selectById(req.APP_DATA.tokenDecoded.id);

      if (user.rows[0].level === 1) {
        next();
      } else {
        failed(res, {
          code: 401,
          payload: "You do not have access",
          message: "Unauthorized",
        });
      }
    } catch (error) {
      failed(res, {
        code: 401,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  // checked
  onlyUser: async (req, res, next) => {
    try {
      const user = await userModel.selectById(req.APP_DATA.tokenDecoded.id);

      if (user.rows[0].level === 2) {
        next();
      } else {
        failed(res, {
          code: 401,
          payload: "You do not have access",
          message: "Unauthorized",
        });
      }
    } catch (error) {
      failed(res, {
        code: 401,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  // checked
  myself: async (req, res, next) => {
    try {
      const idUser = req.APP_DATA.tokenDecoded.id;
      const idUpdate = req.params.id;

      if (idUser === idUpdate) {
        next();
      } else {
        failed(res, {
          code: 401,
          payload: "You do not have access",
          message: "Unauthorized",
        });
      }
    } catch (error) {
      failed(res, {
        code: 401,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  recipeOwner: async (req, res, next) => {
    try {
      const idUser = req.APP_DATA.tokenDecoded.id;
      const idRecipe = req.params.id;
      const recipe = await recipeModel.selectById(idRecipe);

      // jika recipe tidak ditemukan
      if (!recipe.rowCount) {
        next();
      } else {
        // jika id pembuat recipe sama dengan id dari jwt
        if (idUser === recipe.rows[0].user_id) {
          next();
        } else {
          failed(res, {
            code: 401,
            payload: "You do not have access",
            message: "Unauthorized",
          });
        }
      }
    } catch (error) {
      failed(res, {
        code: 401,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
  commentOwner: async (req, res, next) => {
    try {
      const idUser = req.APP_DATA.tokenDecoded.id;
      const idComment = req.params.id;
      const comment = await commentModel.selectById(idComment);

      // jika comment tidak ditemukan
      if (!comment.rowCount) {
        next();
      } else {
        // jika id pembuat comment sama dengan id dari jwt
        if (idUser === comment.rows[0].user_id) {
          next();
        } else {
          failed(res, {
            code: 401,
            payload: "You do not have access",
            message: "Unauthorized",
          });
        }
      }
    } catch (error) {
      failed(res, {
        code: 401,
        payload: error.message,
        message: "Internal Server Error",
      });
    }
  },
};
