const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const chalk = require('chalk');
const cors = require('cors');
require('dotenv').config();

// deklarasi express
const app = express();

// env variabel
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());

// root router
app.get('/', (req, res) =>
  res.send(`Food Recipe API - ${NODE_ENV[0].toUpperCase() + NODE_ENV.slice(1)}`));
// main router
app.use(require('./src/router/auth.route'));
app.use(require('./src/router/user.route'));
app.use(require('./src/router/recipe.route'));
app.use(require('./src/router/comment.route'));
// 404 router
app.use((req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      message: 'Not Found',
    },
  });
});

// running server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} with ${NODE_ENV} environment`);
  console.log(chalk`Visit {rgb(128, 237, 153) http://localhost:${PORT}}`);
  console.log(chalk`Developed by {rgb(255, 92, 88) Andry Pebrianto}`);
});
