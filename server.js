const express = require("express");
const helmet = require("helmet");
const chalk = require("chalk");
const xss = require('xss-clean')
require("dotenv").config();

// deklarasi express
const app = express();

// env variabel
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(helmet());
app.use(xss());

// routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

// running server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} with ${NODE_ENV} environment`);
  console.log(chalk`Visit {rgb(128, 237, 153) http://localhost:${PORT}}`);
  console.log(chalk`Developed by {rgb(255, 92, 88) Andry Pebrianto}`);
});
