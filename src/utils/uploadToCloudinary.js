const { v2: cloudinary } = require("cloudinary");
const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} = require("./env");

module.exports = (file) => {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const opt = { folder: "koleksi-resep" };

    // jika file yg diupload adalah video
    if (file.fieldname === "video") opt.resource_type = "video";

    cloudinary.uploader.upload(file.path, opt, (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  });
};
