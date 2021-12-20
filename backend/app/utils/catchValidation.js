const { validationResult } = require('express-validator');
const AppError = require('./appError');

module.exports = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors
        .array()
        .map((err) => err.msg)
        .join('\n')
    );
  }
};
