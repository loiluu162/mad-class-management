const express = require('express');
const cookieParser = require('cookie-parser');

const db = require('./db');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

module.exports = app;
