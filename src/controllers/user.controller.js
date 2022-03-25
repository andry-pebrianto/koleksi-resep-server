const userModel = require('../models/user.model');
const userValidation = require('../validations/user.validation');

module.exports = {
  list: async (req, res) => {
    const { page } = req.query;
    let limit = 'ALL';
    let offset = 0;

    // menentukan limit & offset berdasarkan page
    if (/[\d]/.test(page)) {
      limit = 3;
      offset = (page - 1) * limit;
    }

    const paging = {
      limit,
      offset,
    };

    try {
      const users = await userModel.selectAll(paging);

      res.json(users.rows);
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
  detail: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await userModel.selectById(id);

      // jika user tidak ditemukan
      if (!user.rows.length) {
        res.json({});
        return;
      }

      res.json(user.rows[0]);
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
  insert: async (req, res) => {
    const { bad, message, body } = userValidation.insertValidation(req.body);

    // jika ada error saat validasi
    if (bad) {
      res.status(400).json({
        status: 400,
        message,
      });
      return;
    }

    try {
      await userModel.store(body);

      res.status(201).json({
        message: 'Insert data user success',
      });
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
  update: async (req, res) => {
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

    try {
      // mengecek user apakah ada
      const user = await userModel.selectById(id);
      if (!user.rows[0]) {
        res.status(404).json({
          error: {
            status: 404,
            message: 'User with that Id not found',
          },
        });
        return;
      }
      await userModel.updateById(id, body);

      res.json({
        message: 'Update data user success',
      });
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
  remove: async (req, res) => {
    const { id } = req.params;

    try {
      // mengecek user apakah ada
      const user = await userModel.selectById(id);
      if (!user.rows[0]) {
        res.status(404).json({
          error: {
            status: 404,
            message: 'User with that Id not found',
          },
        });
        return;
      }
      await userModel.removeById(id);

      res.json({
        message: 'Delete data user success',
      });
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
  listRecipe: async (req, res) => {
    const { id } = req.params;

    try {
      const userRecipes = await userModel.selectAllRecipeByUser(id);

      res.json(userRecipes.rows);
    } catch (error) {
      res.status(500).json({
        error: {
          status: 500,
          message: error.message,
        },
      });
    }
  },
};
