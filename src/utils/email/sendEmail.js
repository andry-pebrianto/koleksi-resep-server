require("dotenv").config();
// eslint-disable-next-line import/no-extraneous-dependencies
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (dataEmail) => {
  try {
    const result = await resend.emails.send(dataEmail);
    console.log(result);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = sendEmail;
