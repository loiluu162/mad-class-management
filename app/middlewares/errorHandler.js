const { StatusCodes } = require('http-status-codes');
const { errorResponse } = require('../utils/response');

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      error: err.message,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render('views/error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return errorResponse(res, err.message, err.statusCode);
    }
    return errorResponse(
      res,
      'Something went very wrong!',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('views/error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  return res.status(err.statusCode).render('views/error', {
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'dev') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'prod') {
    const error = { ...err };
    // handle specific Error by name here
    sendErrorProd(error, req, res);
  }
};
