const express = require('express');
const { verifyToken } = require('../../middlewares/verifyJwt');
const router = express.Router();

const LoginController = require('./controller');

const Validator = require('./validator');

router.post('/login', Validator.validate('login'), LoginController.login);

router.post('/signup', Validator.validate('signup'), LoginController.signup);

router.post(
  '/resetPassword',
  Validator.validate('resetPassword'),
  LoginController.resetPassword
);

router.post(
  '/changePassword',
  [verifyToken],
  Validator.validate('changePassword'),
  LoginController.changePassword
);

router.post(
  '/verifyPasswordResetToken',
  Validator.validate('verifyPasswordResetToken'),
  LoginController.verifyPasswordResetToken
);

router.post(
  '/requestForgotPassword',
  Validator.validate('requestForgotPassword'),
  LoginController.requestForgotPassword
);

router.get('/logout', LoginController.logout);

router.post(
  '/verifyEmail',
  Validator.validate('verifyEmail'),
  LoginController.verifyEmail
);

router.post('/refreshtoken', LoginController.refreshToken);

router.get('/testjwt', [verifyToken], (req, res, next) => {
  res.json(req.userId);
});

module.exports = router;
