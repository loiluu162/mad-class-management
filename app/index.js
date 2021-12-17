const express = require('express');
const cookieParser = require('cookie-parser');
require('./crons');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/appError');

const {
  UserRoute,
  LoginRoute,
  ClassRoute,
  RegistrationRoute,
} = require('./features');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use('/api/users', UserRoute);
app.use('/api/auth', LoginRoute);
app.use('/api/classes', ClassRoute);
app.use('/api/registrations', RegistrationRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
