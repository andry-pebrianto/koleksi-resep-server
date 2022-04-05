const { v4: uuidv4 } = require('uuid');
const commentModel = require('../models/comment.model');
const { success, failed } = require('../utils/createResponse');
const createPagination = require('../utils/createPagination');

module.exports = {
  list: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const count = await commentModel.countAll();
      const paging = createPagination(count.rows[0].count, page, limit);
      const comments = await commentModel.selectAll(req.APP_DATA.tokenDecoded.level, paging);

      success(res, {
        code: 200,
        payload: comments.rows,
        message: 'Select List Comment Success',
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
      const comment = await commentModel.selectById(id);

      // jika comment tidak ditemukan
      if (!comment.rowCount) {
        failed(res, {
          code: 404,
          payload: `Comment with Id ${id} not found`,
          message: 'Select Detail Comment Failed',
        });
        return;
      }

      success(res, {
        code: 200,
        payload: comment.rows[0],
        message: 'Select Detail Comment Success',
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
      await commentModel.store({ id: uuidv4(), ...req.body, idUser: req.APP_DATA.tokenDecoded.id });

      success(res, {
        code: 201,
        payload: null,
        message: 'Insert Comment Success',
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

      const comment = await commentModel.selectById(id);
      // jika comment tidak ditemukan
      if (!comment.rowCount) {
        failed(res, {
          code: 404,
          payload: `Comment with Id ${id} not found`,
          message: 'Update Comment Failed',
        });
        return;
      }
      await commentModel.updateById(id, req.body);

      success(res, {
        code: 200,
        payload: null,
        message: 'Update Comment Success',
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
      const comment = await commentModel.selectById(id);

      // jika comment tidak ditemukan
      if (!comment.rowCount) {
        failed(res, {
          code: 404,
          payload: `Comment with Id ${id} not found`,
          message: 'Delete Comment Failed',
        });
        return;
      }
      await commentModel.removeById(id);

      success(res, {
        code: 200,
        payload: null,
        message: 'Delete Comment Success',
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
      const comment = await commentModel.selectById(id);

      // jika comment tidak ditemukan
      if (!comment.rowCount) {
        failed(res, {
          code: 404,
          payload: `Comment with Id ${id} not found`,
          message: 'Banned Comment Failed',
        });
        return;
      }
      const banned = comment.rows[0].is_active ? 0 : 1;
      await commentModel.bannedById(id, banned);

      success(res, {
        code: 200,
        payload: null,
        message: `${
          comment.rows[0].is_active ? 'Banned' : 'Unbanned'
        } Comment Success`,
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
