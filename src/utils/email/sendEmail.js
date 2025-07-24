require("dotenv").config();
// eslint-disable-next-line import/no-extraneous-dependencies
const { Resend } = require("resend");

const resend = new Resend("re_Yoz8D1kd_DRHgQHfq99yKNRRppAiFis6V");

const sendEmail = async (dataEmail) => {
  try {
    resend.emails.send(dataEmail);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = sendEmail;
