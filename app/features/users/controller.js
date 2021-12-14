const UserService = require('./service');
const { catchAsync } = require('../../utils');
const { messageResponse } = require('../../utils/response');
const getUsers = catchAsync(async (req, res, next) => {
 
  const users = await UserService.getUsers(req);
  return messageResponse(res, 'Successfully users retrieved', users);
});
const getUserById = catchAsync(async (req, res, next) => {
  const user = await UserService.getUserById(req);
  return messageResponse(res, 'Successfully users retrieved', user);
});
const getUserByEmail = catchAsync(async (req, res, next) => {
  const user = await UserService.getUserByEmail(req);
  return messageResponse(res, 'Successfully users retrieved', user);
});

const updateUserInformation = catchAsync(async (req, res, next) => {
  const user = await UserService.getUserByEmail(req);
  return messageResponse(res, 'Successfully users retrieved', user);
});

module.exports = { getUsers, getUserById, getUserByEmail, updateUserInformation };
