const jwt = require('jsonwebtoken');
const {
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenExpireIn,
  refreshTokenExpireIn,
} = require('../config').tokenConfig;
exports.generate = () => Math.floor(1000 + Math.random() * 9000) + '';

exports.generateAccessToken = (userId) => {
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ sub: userId, id: userId }, accessTokenSecret, {
    expiresIn: accessTokenExpireIn,
  });
};

exports.generateRefreshToken = (userId) => {
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ sub: userId, id: userId }, refreshTokenSecret, {
    expiresIn: refreshTokenExpireIn,
  });
};
