<div align="center">
  <img src="./readme/logo.svg" />
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
- [Google Auth Library](https://www.npmjs.com/package/google-auth-library)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Nodemailer](https://nodemailer.com/about/)
- [AWS SDK](https://aws.amazon.com/id/sdk-for-javascript/)

## Getting Started

### Installation

- Clone this project with `git clone https://github.com/andry-pebrianto/koleksi-resep-api.git
- Install package required with `npm install`
- Setting .env

```bash
APP_NAME=
NODE_ENV=
PORT=
API_URL=
CLIENT_URL=

# database
PGUSER=
PGHOST=
PGPASSWORD=
PGDATABASE=
PGPORT=

# jwt
ACCESS_TOKEN_KEY=
REFRESH_TOKEN_KEY=

# google
EMAIL_FROM=
EMAIL_USER=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
REDIRECT_URI=
GMAIL_REFRESH_TOKEN=

# aws
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
```

- Migrate database using `npm run migrate up`

### Executing program

- Run program with `npm run dev` for development and `npm run start` for production

<!-- RELATED PROJECT -->
## Related Project

- [Koleksi Resep Client](https://github.com/andry-pebrianto/koleksi-resep-client)
- [Koleksi Resep Demo](https://koleksi-resep.netlify.app/)

## Endpoint List

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/13299472-ec1eb813-6223-4446-9308-16157093fa8b?action=collection%2Ffork&collection-url=entityId%3D13299472-ec1eb813-6223-4446-9308-16157093fa8b%26entityType%3Dcollection%26workspaceId%3Da3c91d80-a923-40e7-b2c6-2dfe902a86a7)


## Authors

Contributors names and contact info:

1. Andry Pebrianto

- [Linkedin](https://www.linkedin.com/in/andry-pebrianto)

## License

This project is licensed under the MIT License - see the LICENSE file for details
