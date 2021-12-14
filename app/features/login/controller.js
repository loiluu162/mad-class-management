const LoginService = require('./service');
const { catchAsync } = require('../../utils');
const { messageResponse } = require('../../utils/response');

const login = catchAsync(async (req, res, next) => {
  await LoginService.login(req);
  return messageResponse(res, 'Successfully logged in');
});

const signup = catchAsync(async (req, res, next) => {
  await LoginService.signup(req);
  return messageResponse(
    res,
    'Successfully signed up. Please check email for confirmation'
  );
});

const logout = catchAsync(async (req, res) => {
  req.session.destroy((_) => {
    res.redirect('/login');
  });
});

const requestForgotPassword = catchAsync(async (req, res, next) => {
  await LoginService.requestForgotPassword(req);
  return messageResponse(
    res,
    'Successfully signed up. Please check email for confirmation'
  );
});

const resetPassword = catchAsync(async (req, res, next) => {
  await LoginService.resetPassword(req);
  return messageResponse(res, 'Successfully reset your password');
});

const verifyPasswordResetToken = catchAsync(async (req, res, next) => {
  await LoginService.verifyPasswordResetToken(req);
  return messageResponse(res, 'Token valid');
});

const verifyEmail = catchAsync(async (req, res, next) => {
  await LoginService.verifyEmail(req);
  return messageResponse(res, 'Email successfully verified');
});

const changePassword = catchAsync(async (req, res, next) => {
  await LoginService.changePassword(req);
  return messageResponse(res, 'Password successfully changed');
});

module.exports = {
  login,
  signup,
  resetPassword,
  requestForgotPassword,
  logout,
  verifyEmail,
  verifyPasswordResetToken,
  changePassword,
};
