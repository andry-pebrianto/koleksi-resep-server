<div align="center">
  <img src="./readme/logo.png" width="200px" height="200px" />
</div>
<h3 align="center">Koleksi Resep API</h3>
<p align="center">
  <a href="https://koleksi-resep.herokuapp.com/">View API Demo</a>
  ·
  <a href="https://github.com/andry-pebrianto/koleksi-resep-api/issues">Report Bug</a>
</p>

<!-- ABOUT THE PROJECT -->
## About The Project

This is a Restful API repository for Koleksi Resep. This Restful API is built using ExpressJS and PostgreSQL.

### Technology Used

- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [Google APIs](https://github.com/googleapis/google-api-nodejs-client)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Nodemailer](https://nodemailer.com/about/)

## Getting Started

### Installation

- Clone this project with `git clone https://github.com/andry-pebrianto/koleksi-resep-api`
- Install package required with `npm install`
- Setting .env

```bash
APP_NAME=
NODE_ENV=
PORT=
API_URL=

# database
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=

# jwt
JWT_SECRET=

# google
EMAIL_FROM=
EMAIL_USER=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
REDIRECT_URI=
GMAIL_REFRESH_TOKEN=
DRIVE_REFRESH_TOKEN=
```

### Executing program

- Run program with `npm run dev` for development and `npm run start` for production

## Endpoint List

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/13299472-79161dab-60b5-451a-9e75-f635d682c31b?action=collection%2Ffork&collection-url=entityId%3D13299472-79161dab-60b5-451a-9e75-f635d682c31b%26entityType%3Dcollection%26workspaceId%3Dabfee31e-a51e-46f4-a705-bd3638f6adf7)

### /auth

- POST | `/auth/register`
  - Body:
    - name (required | alphabet | max 50)
    - email (required | valid email | max 50)
    - phone (required | number | max 13)
    - password (min 8 | contain lowercase, uppercase, number, and special character)
    - photo (max 2mb | jpg, jpeg, png)
  - Token: Not required
  - Desc: New user registration
- GET | `/auth/activation/:token`
  - Body: None
  - Token: Not required
  - Desc: User activation via a link from an email
- POST | `/auth/login`
  - Body:
    - email (required | valid email)
    - password (required)
  - Token: Not required
  - Desc: Login
- POST | `/auth/forgot`
  - Body:
    - email (required | valid email)
  - Token: Not required
  - Desc: Send an email link to reset password
- POST | `/auth/reset`
  - Body:
    - password (min 8 | contain lowercase, uppercase, number, and special character)
  - Token: Not required
  - Desc: Reset password

### /user

- GET | `/user`
  - Body: None
  - Token: Required
  - Desc: Get a list of users registered in the database
- GET | `/user/:id`
  - Body: None
  - Token: Required
  - Desc: Get detailed user data based on the entered id
- PUT | `/user/:id`
  - Body:
    - name (required | alphabet | max 50)
    - phone (required | number | max 13)
    - photo (max 2mb | jpg, jpeg, png)
  - Token: Required
  - Desc: Update user data based on entered id
- PUT | `/user/:id/password`
  - Body:
    - password (min 8 | contain lowercase, uppercase, number, and special character)
  - Token: Required
  - Desc: Change password
- DELETE | `/user/:id`
  - Body: None
  - Token: Required
  - Desc: Delete user data based on the entered id
- GET | `user/:id/recipe`
  - Body: None
  - Token: Required
  - Desc: Get all recipe data owned by a user
- PUT | `user/banned/:id`
  - Body: None
  - Token: Required
  - Desc: Banned or Unbanned user

### /recipe

- GET | `/recipe`
  - Body: None
  - Token: Required
  - Desc: Get all recipe data
  - Query: 
    - limit (number | default 10)
    - page (number)
    - search (string)
    - sort (column name | default title)
- GET | `/recipe/:id`
  - Body: None
  - Token: Required
  - Desc: Get recipe data details based on the entered id
- GET | `/recipe/latest`
  - Body: None
  - Token: Not required
  - Desc: Get the latest 5 recipe data
- POST | `/recipe`
  - Body:
    - title (required | alphabet & number | max 50)
    - ingredients (required)
    - photo (max 2mb | jpg, jpeg, png)
    - video (max 50mb | mp4, 3gp)
  - Token: Required
  - Desc: Add new recipe data to database
- PUT | `/recipe/:id`
  - Body:
    - title (required | alphabet & number | max 50)
    - ingredients (required)
    - photo (max 2mb | jpg, jpeg, png)
    - video (max 50mb | mp4, 3gp)
  - Token: Required
  - Desc: Update recipe data based on entered id
- DELETE | `/recipe/:id`
  - Body: None
  - Token: Required
  - Desc: Delete recipe data based on the entered id
- PUT | `/recipe/banned/:id`
  - Body: None
  - Token: Required
  - Desc: Banned or Unbanned recipe
- GET | `/recipe/:id/comment`
  - Body: None
  - Token: Required
  - Desc: Get all comment data owned by a recipe

### /comment

- GET | `/comment`
  - Body: None
  - Token: Required
  - Desc: Get all comment data
- GET | `/comment/:id`
  - Body: None
  - Token: Required
  - Desc: Get comment data details based on the entered id
- POST | `/comment`
  - Body:
    - commentText (required | max 500)
    - recipeId (required)
  - Token: Required
  - Desc: Add new comment data to database
- PUT | `/comment/:id`
  - Body:
    - commentText (required | max 500)
  - Token: Required
  - Desc: Update comment data based on entered id
- DELETE | `/comment/:id`
  - Body: None
  - Token: Required
  - Desc: Delete comment data based on the entered id
- PUT | `/coomment/banned/:id`
  - Body: None
  - Token: Required
  - Desc: Banned or Unbanned comment

## Authors

Contributors names and contact info:

1. Andry Pebrianto

- [Linkedin](https://www.linkedin.com/in/andry-pebrianto)

## License

This project is licensed under the MIT License - see the LICENSE file for details
