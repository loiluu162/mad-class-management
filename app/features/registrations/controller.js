const { catchAsync } = require('../../utils');

const RegistrationService = require('./service');

const getAllRegistrations = catchAsync(async (req, res, next) => {});
const createNewRegistration = catchAsync(async (req, res, next) => {});

module.exports = { getAllRegistrations, createNewRegistration };
