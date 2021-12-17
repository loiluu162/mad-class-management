const express = require('express');
// const router = express.Router();

const UserRoute = require('./users/route');
const LoginRoute = require('./login/route');
const ClassRoute = require('./classes/route');

module.exports = { UserRoute, LoginRoute, ClassRoute };
