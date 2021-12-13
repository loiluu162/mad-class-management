const { StatusCodes } = require('http-status-codes');

exports.messageResponse = (
  res,
  message,
  content = null,
  statusCode = StatusCodes.OK
) => {
  res.status(statusCode).json({
    status: statusCode,
    message,
    content,
  });
};

exports.errorResponse = (res, error, statusCode = StatusCodes.BAD_REQUEST) => {
  res.status(statusCode).json({
    status: statusCode,
    error,
  });
};
