const { catchAsync } = require('../../utils');
const { messageResponse } = require('../../utils/responseWrapper');
const ClassService = require('./service');

const getAllClasses = catchAsync(async (req, res, next) => {
  const classes = await ClassService.getAllClasses(req);
  return messageResponse(res, 'successfully retrieved classes', classes);
});
const getAllMyClasses = catchAsync(async (req, res, next) => {
  const classes = await ClassService.getAllMyClasses(req);
  return messageResponse(res, 'successfully retrieved your classes', classes);
});

const createNewClass = catchAsync(async (req, res, next) => {
  const data = await ClassService.createNewClass(req);
  return messageResponse(res, 'successfully created classes', data);
});

const getClass = catchAsync(async (req, res, next) => {
  const classRes = await ClassService.getClass(req);
  return messageResponse(res, 'successfully retrieved class', classRes);
});
const getClassWithStatus = catchAsync(async (req, res, next) => {
  const classRes = await ClassService.getClassWithStatus(req);
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
const deleteStudyTime = catchAsync(async (req, res, next) => {
  await ClassService.deleteStudyTime(req);
  return messageResponse(res, 'successfully deleted class');
});

module.exports = {
  getAllClasses,
  createNewClass,
  getClass,
  updateClass,
  deleteClass,
  deleteStudyTime,
  getAllMyClasses,
  getClassWithStatus,
};
