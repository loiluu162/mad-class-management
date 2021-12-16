const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const { UserRepo } = require('../features/users/rep');

const { TokenExpiredError } = jwt;

const { accessTokenSecret } = require('../config').jwtConfig;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: 'Unauthorized! Access Token was expired!' });
  }

  return res
    .sendStatus(StatusCodes.UNAUTHORIZED)
    .send({ message: 'Unauthorized!' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .send({ message: 'No token provided!' });
  }

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

// const isAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRoles().then((roles) => {
//       if (roles.some((role) => role.name === 'ROLE_ADMIN')) next();
//       res.status(StatusCodes.FORBIDDEN).send({
//         message: 'Require Admin Role!',
//       });
//     });
//   });
// };

// const isModerator = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRoles().then((roles) => {
//       if (roles.some((role) => role.name === 'ROLE_MOD')) next();

//       res.status(StatusCodes.FORBIDDEN).send({
//         message: 'Require Moderator Role!',
//       });
//     });
//   });
// };

// const isModeratorOrAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then((user) => {
//     user.getRoles().then((roles) => {
//       if (
//         roles.some(
//           (role) => role.name === 'ROLE_ADMIN' || role.name === 'ROLE_MOD'
//         )
//       ) {
//         next();
//       }
//       res.status(StatusCodes.FORBIDDEN).send({
//         message: 'Require Moderator or Admin Role!',
//       });
//     });
//   });
// };

const hasAnyRole = (requiredRoles) => {
  return (req, res, next) => {
    const user = UserRepo.findById(req.userId);
    user.getRoles().then((roles) => {
      if (roles.some((role) => requiredRoles.includes(role))) {
        next();
      }
      res.status(StatusCodes.FORBIDDEN).send({
        message: 'Required at least one role in ' + requiredRoles,
      });
    });
  };
};

const authJwt = {
  verifyToken,
  hasAnyRole,
};
module.exports = authJwt;
