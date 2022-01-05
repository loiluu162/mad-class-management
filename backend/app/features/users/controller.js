const UserService = require('./service');
const { catchAsync } = require('../../utils');
const { messageResponse } = require('../../utils/responseWrapper');

const getUsers = catchAsync(async (req, res, next) => {
  const users = await UserService.getUsers(req);
  return messageResponse(res, 'Successfully users retrieved', users);
});
const getUser = catchAsync(async (req, res, next) => {
  const user = await UserService.getUser(req);
  return messageResponse(res, 'Successfully user info retrieved', user);
});
const createNewUser = catchAsync(async (req, res, next) => {
  const user = await UserService.createNewUser(req);
  return messageResponse(res, 'Successfully user created', user);
});

const blockUser = catchAsync(async (req, res, next) => {
  const user = await UserService.blockUser(req);
  return messageResponse(res, 'Successfully', user);
});
const changeAvatar = catchAsync(async (req, res, next) => {
  const data = await UserService.handleSaveAvatar(req);
  return messageResponse(res, 'Successfully change your avatar', data);
});
const changeInfo = catchAsync(async (req, res, next) => {
  const data = await UserService.changeInfo(req);
  return messageResponse(res, 'Successfully change your info', data);
});

module.exports = {
  getUsers,
  getUser,
  changeAvatar,
  changeInfo,
  createNewUser,
  blockUser,
};
