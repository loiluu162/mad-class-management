const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

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
app.use(cors());
app.use(helmet());
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use(xss());
app.use(compression());
app.set('view engine', 'html');

app.use('/api', limiter);
app.use('/api/users', UserRoute);
app.use('/api/auth', LoginRoute);
app.use('/api/classes', ClassRoute);
app.use('/api/registrations', RegistrationRoute);
app.get('/', (req, res) => res.send('Hello world'));
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
