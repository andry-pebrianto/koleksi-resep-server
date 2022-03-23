const { Pool } = require('pg');
require('dotenv').config();

const {
  DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT,
} = process.env;

const db = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
  console.log('Database berhasil terhubung.');
});

module.exports = db;
