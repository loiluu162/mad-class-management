const redisStore = {
  host: process.env.REDIS_STORE_HOST,
  secret: process.env.REDIS_STORE_SECRET,
  port: process.env.REDIS_STORE_PORT,
};
const databaseConnectionString = process.env.DB_CONNECTION_STRING;

const emailConfig = {
  from: process.env.EMAIL_FROM,
  user: process.env.EMAIL_USERNAME,
  pass: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST_PROVIDER,
};
const tokenConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpireIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
  refreshTokenExpireIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
  verificationExpireIn: process.env.VERIFICATION_CODE_EXPIRES_IN,
  passwordResetExpireIn: process.env.PASSWORD_RESET_CODE_EXPIRES_IN,
};

module.exports = {
  tokenConfig,
  redisStore,
  databaseConnectionString,
  emailConfig,
};
