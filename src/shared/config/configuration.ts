export default () => ({
  app: {
    url: process.env.APP_URL,
  },
  database: {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
  },

  allowOrigins: process.env.ALLOW_ORIGINS.split(','),
  exposeHeaders: process.env.EXPOSE_HEADERS.split(','),

  jwt: {
    secret: process.env.JWT_SECRET_KEY,
  },
  mail: {
    sendgrid: {
      key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_SENDER_EMAIL,
    },
  },
  token: {
    expiry: {
      signin: process.env.JWT_SIGNIN_TOKEN_EXPIRES_IN,
      userVerification: process.env.JWT_USER_VERIFICATION_TOKEN_EXPIRES_IN,
    },
  },
});
