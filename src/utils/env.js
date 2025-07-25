require("dotenv").config();

module.exports = {
  APP_NAME: process.env.APP_NAME || "Koleksi Resep",
  NODE_ENV: process.env.NODE_ENV || "dev",
  PORT: process.env.PORT || 5000,
  API_URL: process.env.API_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  PGSSLMODE: process.env.PGSSLMODE,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_FROM: process.env.EMAIL_FROM,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};
