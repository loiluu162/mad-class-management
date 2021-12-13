const UserService = require('./service');
const { catchAsync } = require('../../utils');
const { messageResponse } = require('../../utils/response');
const getUsers = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const users = await UserService.getUsers({}, page, limit);
  return messageResponse(res, 'Successfully users retrieved', users);
});

module.exports = { getUsers };