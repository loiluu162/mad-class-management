const { catchAsync } = require('../../utils');
const { messageResponse } = require('../../utils/responseWrapper');

const RegistrationService = require('./service');

const getAllRegistrations = catchAsync(async (req, res, next) => {
  const registrations = await RegistrationService.getAllRegistrations();
  return messageResponse(
    res,
    'successfully retrieved registrations',
    registrations
  );
});

const createNewRegistration = catchAsync(async (req, res, next) => {
  const registrations = await RegistrationService.createNewRegistration(req);
  return messageResponse(
    res,
    'successfully created registration',
    registrations
  );
});

const cancelRegistration = catchAsync(async (req, res, next) => {
  await RegistrationService.cancelRegistration(req);

  return messageResponse(res, 'successfully canceled registration');
});
const changeStatusRegistration = catchAsync(async (req, res, next) => {
  await RegistrationService.changeStatusRegistration(req);
  return messageResponse(res, 'successfully changed status for registration');
});

module.exports = {
  getAllRegistrations,
  createNewRegistration,
  cancelRegistration,
  changeStatusRegistration,
};
