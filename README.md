<h1 align="center">Koleksi Resep API</h1>

## Description

Koleksi Resep API is a Web Service which will later become the Backend for a food recipe sharing application

## Getting Started

### Technology Used

- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [Google APIs](https://github.com/googleapis/google-api-nodejs-client)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Nodemailer](https://nodemailer.com/about/)

### Installing

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

## Authors

Contributors names and contact info:

1. Andry Pebrianto

- [Linkedin](https://www.linkedin.com/in/andry-pebrianto)

## License

This project is licensed under the MIT License - see the LICENSE file for details
