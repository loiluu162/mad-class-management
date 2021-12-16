const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const { UserRepo } = require('../features/users/repo');

const { accessTokenSecret } = require('../config').tokenConfig;

const AppError = require('../utils/appError');

const verifyToken = async (req, res, next) => {
  console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return next(
        new AppError('Token provide type wrong', StatusCodes.FORBIDDEN)
      );
    }

    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        next(
          new AppError(
            'Unauthorized! Access Token was not existed or expired!',
            StatusCodes.UNAUTHORIZED
          )
        );
      }
      UserRepo.findOne({ id: decoded.id, enabled: true, blocked: false }).then(
        (user) => {
          if (!user) {
            next(
              new AppError(
                'The user belonging to this token does no longer exist.',
                StatusCodes.FORBIDDEN
              )
            );
          }
        }
      );
      req.userId = decoded.id;
      next();
    });
  } else next(new AppError('No token provided!', StatusCodes.FORBIDDEN));
};

const hasAnyRole = (requiredRoles) => {
  return (req, res, next) => {
    const user = UserRepo.findById(req.userId);
    user.getRoles().then((roles) => {
      if (roles.some((role) => requiredRoles.includes(role))) {
        next();
      }
      return next(
        new AppError(
          'Required at least one role in ' + requiredRoles,
          StatusCodes.FORBIDDEN
        )
      );
    });
  };
};

const authJwt = {
  verifyToken,
  hasAnyRole,
};
module.exports = authJwt;
