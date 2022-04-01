const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const chalk = require('chalk');
const cors = require('cors');
const { NODE_ENV, PORT } = require('./src/utils/env');
const { failed } = require('./src/utils/createResponse');

// deklarasi express
const app = express();

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
  failed(res, {
    code: 404,
    payload: 'Resource on that url not found',
    message: 'Not Found',
  });
});

// running server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} with ${NODE_ENV} environment`);
  console.log(chalk`Visit {rgb(128, 237, 153) http://localhost:${PORT}}`);
  console.log(chalk`Developed by {rgb(255, 92, 88) Andry Pebrianto}`);
});
