const UserService = require('./service');
const { catchAsync } = require('../../utils');
const { messageResponse } = require('../../utils/responseWrapper');
const getUsers = catchAsync(async (req, res, next) => {
  const users = await UserService.getUsers(req);
  return messageResponse(res, 'Successfully users retrieved', users);
});
const getUser = catchAsync(async (req, res, next) => {
  const user = await UserService.getUserById(req);
  return messageResponse(res, 'Successfully user info retrieved', user);
});

const updateUser = catchAsync(async (req, res, next) => {
  const user = await UserService.getUserByEmail(req);
  return messageResponse(res, 'Successfully updated user info', user);
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
};
