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
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
module.exports = {
  accessTokenSecret,
  redisStore,
  databaseConnectionString,
  emailConfig,
};
