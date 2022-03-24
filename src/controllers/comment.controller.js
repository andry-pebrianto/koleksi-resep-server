const commentModel = require('../models/comment.model');
const commentValidation = require('../validations/comment.validation');

module.exports = {
  list: async (req, res) => {
    try {
      const comments = await commentModel.selectAll();

      res.json(comments.rows);
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
      const comment = await commentModel.selectById(id);

      // jika comment tidak ditemukan
      if (!comment.rows.length) {
        res.json({});
        return;
      }

      res.json(comment.rows[0]);
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
    const { bad, message, body } = commentValidation.insertValidation(req.body);

    // jika ada error saat validasi
    if (bad) {
      res.status(400).json({
        status: 400,
        message,
      });
      return;
    }

    try {
      await commentModel.store(body);

      res.status(201).json({
        message: 'Insert data comment success',
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
    const { bad, message, body } = commentValidation.insertValidation(req.body);

    // jika ada error saat validasi
    if (bad) {
      res.status(400).json({
        status: 400,
        message,
      });
      return;
    }

    try {
      // mengecek comment apakah ada
      const comment = await commentModel.selectById(id);
      if (!comment.rows[0]) {
        res.status(404).json({
          error: {
            status: 404,
            message: 'Comment with that Id not found',
          },
        });
        return;
      }
      await commentModel.updateById(id, body);

      res.json({
        message: 'Update data comment success',
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
      // mengecek comment apakah ada
      const comment = await commentModel.selectById(id);
      if (!comment.rows[0]) {
        res.status(404).json({
          error: {
            status: 404,
            message: 'Comment with that Id not found',
          },
        });
        return;
      }
      await commentModel.removeById(id);

      res.json({
        message: 'Delete data comment success',
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
};
