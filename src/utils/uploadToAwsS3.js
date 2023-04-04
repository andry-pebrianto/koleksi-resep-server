const AWS = require("aws-sdk");
const fs = require("fs");
const { AWS_BUCKET_NAME } = require("./env");

module.exports = (file) => {
  const awsS3 = new AWS.S3();

  const parameter = {
    Bucket: AWS_BUCKET_NAME,
    Key: `${new Date().getTime()}-${file.filename}`,
    Body: fs.createReadStream(file.path),
    ContentType: file.mimetype,
  };

  return new Promise((resolve, reject) => {
    awsS3.upload(parameter, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data.Location);
    });
  });
};
