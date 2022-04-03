const userModel = require('../models/user.model');
const recipeModel = require('../models/recipe.model');
const { failed } = require('../utils/createResponse');

module.exports = {
  isVerified: async (req, res, next) => {
    try {
      const user = await userModel.selectByEmail(req.body.email);

      if (!user.rowCount) {
        next();
      } else if (user.rows[0].verified === 1) {
        next();
      } else {
        failed(res, {
          code: 401,
          payload: 'Your email is not verified yet',
          message: 'Unauthorized',
        });
      }
    } catch (error) {
      failed(res, {
        code: 500,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  onlyAdmin: async (req, res, next) => {
    try {
      const user = await userModel.selectById(req.APP_DATA.tokenDecoded.id);

      if (user.rows[0].level === 0) {
        next();
      } else {
        failed(res, {
          code: 401,
          payload: 'You do not have access',
          message: 'Unauthorized',
        });
      }
    } catch (error) {
      failed(res, {
        code: 401,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  onlyUser: async (req, res, next) => {
    try {
      const user = await userModel.selectById(req.APP_DATA.tokenDecoded.id);

      if (user.rows[0].level === 1) {
        next();
      } else {
        failed(res, {
          code: 401,
          payload: 'You do not have access',
          message: 'Unauthorized',
        });
      }
    } catch (error) {
      failed(res, {
        code: 401,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
  myself: async (req, res, next) => {
    try {
      const idUser = req.APP_DATA.tokenDecoded.id;
      const idUpdate = req.params.id;

      if (idUser === idUpdate) {
        next();
      } else {
        failed(res, {
          code: 401,
          payload: 'You do not have access',
          message: 'Unauthorized',
        });
      }
    } catch (error) {
      failed(res, {
        code: 401,
        payload: error.message,
        message: 'Internal Server Error',
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
            payload: 'You do not have access',
            message: 'Unauthorized',
          });
        }
      }
    } catch (error) {
      failed(res, {
        code: 401,
        payload: error.message,
        message: 'Internal Server Error',
      });
    }
  },
};
