const tagModel = require("../models/tag.model");
const { success, failed } = require("../utils/createResponse");

module.exports = {
  list: async (req, res) => {
    try {
      const tags = await tagModel.selectAll();

      success(res, {
        code: 200,
        payload: tags.rows,
        message: "Select List Tag Success",
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
