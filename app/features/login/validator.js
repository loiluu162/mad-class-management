const { body } = require('express-validator');
const UserRepo = require('../users/repo');

const {
  EMAIL_CONFIRMATION_PURPOSE,
  PASSWORD_RESET_PURPOSE,
} = require('../../constants');
const { PasswordUtils } = require('../../utils');
const AppError = require('../../utils/appError');
const { StatusCodes } = require('http-status-codes');

exports.validate = (method) => {
  switch (method) {
    case 'signup': {
      return [
        body('name', 'User full name required ').exists().trim(),
        body('password').isLength({ min: 6 }),
        body('confirmPassword').custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new AppError('Password confirmation does not match password');
          }
          return true;
        }),
        body('email', 'Invalid email').exists().isEmail().trim(),
        body('email').custom((email) => {
          return UserRepo.isExistsEmail(email).then((existed) => {
            if (existed) {
              return Promise.reject(
                new AppError('E-mail already in use', StatusCodes.FORBIDDEN)
              );
            }
          });
        }),
      ];
    }
    case 'login': {
      return [
        body('email', 'User email required ').exists(),
        body('email').custom((email) => {
          return UserRepo.isExistsEmail(email).then((existed) => {
            if (!existed) {
              return Promise.reject(new AppError('E-mail not existed in use'));
            }
          });
        }),
        body('password', 'Password required with minimum length 6 ').isLength({
          min: 6,
        }),
      ];
    }
    case 'verifyPasswordResetToken': {
      return [
        body('code').custom((code) => {
          return UserRepo.getValidToken(code, PASSWORD_RESET_PURPOSE).then(
            (token) => {
              if (!token) {
                return Promise.reject(
                  new AppError(
                    'Password reset code was wrong or had been expired or used'
                  )
                );
              }
            }
          );
        }),
      ];
    }
    case 'verifyEmail': {
      return [
        body('code').custom((code) => {
          return UserRepo.getValidToken(code, EMAIL_CONFIRMATION_PURPOSE).then(
            (token) => {
              if (!token) {
                return Promise.reject(
                  new AppError(
                    'Confirm code was wrong or had been expired or used'
                  )
                );
              }
            }
          );
        }),
      ];
    }
    case 'resetPassword': {
      return [
        body('newPassword').isLength({ min: 6 }),
        body('confirmNewPassword').custom((value, { req }) => {
          if (value !== req.body.newPassword) {
            throw new AppError('Password confirmation does not match password');
          }
          return true;
        }),
        body('code').custom((code) => {
          return UserRepo.getValidToken(code, PASSWORD_RESET_PURPOSE).then(
            (token) => {
              if (!token) {
                return Promise.reject(
                  new Error('Password reset token had been expired or used')
                );
              }
            }
          );
        }),
      ];
    }
    case 'requestForgotPassword': {
      return [
        body('email', 'Invalid email').exists().isEmail().trim(),
        body('email').custom((email) => {
          return UserRepo.isExistsEmail(email).then((existed) => {
            if (!existed) {
              return Promise.reject(
                new AppError('Email not existed in use', StatusCodes.FORBIDDEN)
              );
            }
          });
        }),
      ];
    }
    case 'changePassword': {
      return [
        body('oldPassword').isLength({ min: 6 }),
        body('oldPassword').custom((oldPassword, { req }) => {
          const { userId } = req.session;
          return UserRepo.getUserById(userId).then(async (user) => {
            if (!user) {
              return Promise.reject(new Error('User not found'));
            }

            if (!(await PasswordUtils.compare(oldPassword, user.password))) {
              throw new AppError('Current password wrong');
            }
          });
        }),
        body('newPassword').custom((newPassword, { req }) => {
          if (newPassword === req.body.oldPassword) {
            throw new AppError(
              'New password need to be different from current one'
            );
          }
          return true;
        }),
        body('confirmNewPassword').custom((value, { req }) => {
          if (value !== req.body.newPassword) {
            throw new AppError(
              'New password confirmation does not match password'
            );
          }
          return true;
        }),
      ];
    }
  }
};
