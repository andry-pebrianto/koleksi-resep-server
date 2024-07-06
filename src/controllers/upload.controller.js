const { success, failed } = require("../utils/createResponse");
const deleteFile = require("../utils/deleteFile");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

module.exports = {
  uploadToAws: async (req, res) => {
    try {
      let photo = null;
      let video = null;

      if (req.files) {
        // upload photo
        if (req.files.photo) {
          photo = await uploadToCloudinary(req.files.photo[0]);
          deleteFile(req.files.photo[0].path);
        }
        // upload video
        if (req.files.video) {
          video = await uploadToCloudinary(req.files.video[0]);
          deleteFile(req.files.video[0].path);
        }
      }

      success(res, {
        code: 200,
        payload: {
          photo: photo?.secure_url,
          video: video?.secure_url,
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
