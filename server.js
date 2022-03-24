const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const createError = require('http-errors');
const chalk = require('chalk');
require('dotenv').config();

const userRouter = require('./src/router/user.route');
const recipeRouter = require('./src/router/recipe.route');
const commentRouter = require('./src/router/comment.route');

// deklarasi express
const app = express();

// env variabel
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(helmet());
app.use(xss());

// router middleware
app.get('/', (req, res) => res.send('Recipe Food API')); // root
app.use(userRouter); // user
app.use(recipeRouter); // recipe
app.use(commentRouter); // recipe
app.use((req, res, next) => next(createError.NotFound())); // 404 not found

// error handler middleware
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.log(error);

  const status = error.status || 500;
  res.status(status).json({
    error: {
      status,
      message: error.message || 'Internal Server Error',
    },
  });
});

// running server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} with ${NODE_ENV} environment`);
  console.log(chalk`Visit {rgb(128, 237, 153) http://localhost:${PORT}}`);
  console.log(chalk`Developed by {rgb(255, 92, 88) Andry Pebrianto}`);
});
