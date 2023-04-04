const { success, failed } = require("../utils/createResponse");
const deleteFile = require("../utils/deleteFile");
const uploadToAwsS3 = require("../utils/uploadToAwsS3");

module.exports = {
  uploadToAws: async (req, res) => {
    try {
      let photo = null;
      let video = null;

      if (req.files) {
        // upload photo
        if (req.files.photo) {
          photo = await uploadToAwsS3(req.files.photo[0]);
          deleteFile(req.files.photo[0].path);
        }
        // upload video
        if (req.files.video) {
          video = await uploadToAwsS3(req.files.video[0]);
          deleteFile(req.files.video[0].path);
        }
      }

      success(res, {
        code: 200,
        payload: {
          photo,
          video,
        },
        message: "Upload Success",
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
