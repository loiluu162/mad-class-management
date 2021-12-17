const { catchAsync } = require('../../utils');
const { messageResponse } = require('../../utils/responseWrapper');
const ClassService = require('./service');

const getAllClasses = catchAsync(async (req, res, next) => {
  const classes = await ClassService.getAllClasses();
  return messageResponse(res, 'successfully retrieved classes', classes);
});

const createNewClass = catchAsync(async (req, res, next) => {
  await ClassService.createNewClass(req);
  return messageResponse(res, 'successfully created classes');
});

const getClass = catchAsync(async (req, res, next) => {
  const classRes = await ClassService.getClass(req);
  return messageResponse(res, 'successfully retrieved class', classRes);
});

const updateClass = catchAsync(async (req, res, next) => {
  await ClassService.updateClass(req);
  return messageResponse(res, 'successfully updated class');
});

const deleteClass = catchAsync(async (req, res, next) => {
  await ClassService.deleteClass(req);
  return messageResponse(res, 'successfully deleted class');
});

module.exports = {
  getAllClasses,
  createNewClass,
  getClass,
  updateClass,
  deleteClass,
};
