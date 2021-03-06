const { body } = require('express-validator');
const { UserRepo, TokenRepo } = require('../users/repo');
const { Op } = require('sequelize');

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
          return UserRepo.findOne({ email }).then((existed) => {
            if (existed) {
              return Promise.reject(
                new AppError('Email already in use', StatusCodes.BAD_REQUEST)
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
          return UserRepo.findOne({ email }).then((existed) => {
            if (!existed) {
              return Promise.reject(new AppError('Email not existed in use'));
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
          return TokenRepo.findOne({
            token: code,
            purpose: PASSWORD_RESET_PURPOSE,
            expiresAt: { [Op.gt]: new Date() },
            usedAt: { [Op.eq]: null },
          }).then((token) => {
            if (!token) {
              return Promise.reject(
                new AppError(
                  'Password reset code was wrong or had been expired or used'
                )
              );
            }
          });
        }),
      ];
    }
    case 'verifyEmail': {
      return [
        body('code').custom((code) => {
          return TokenRepo.findOne({
            token: code,
            purpose: EMAIL_CONFIRMATION_PURPOSE,
          }).then((token) => {
            if (!token) {
              return Promise.reject(
                new AppError(
                  'Confirm code was wrong or had been expired or used'
                )
              );
            }
          });
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
          return TokenRepo.findOne({
            token: code,
            purpose: PASSWORD_RESET_PURPOSE,
            expiresAt: { [Op.gt]: new Date() },
            usedAt: { [Op.eq]: null },
          }).then((token) => {
            if (!token) {
              return Promise.reject(
                new Error('Password reset token had been expired or used')
              );
            }
          });
        }),
      ];
    }
    case 'requestForgotPassword': {
      return [
        body('email', 'Invalid email').exists().isEmail().trim(),
        body('email').custom((email) => {
          return UserRepo.findOne({ email }).then((existed) => {
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
        body('currentPassword').isLength({ min: 6 }),
        body('currentPassword').custom((currentPassword, { req }) => {
          const { userId } = req;
          return UserRepo.findById(userId).then(async (user) => {
            if (!user) {
              return Promise.reject(new Error('User not found'));
            }

            if (
              !(await PasswordUtils.compare(currentPassword, user.password))
            ) {
              throw new AppError('Current password wrong');
            }
          });
        }),
        body('newPassword').custom((newPassword, { req }) => {
          if (newPassword === req.body.currentPassword) {
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
