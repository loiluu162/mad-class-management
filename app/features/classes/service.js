const { StatusCodes } = require('http-status-codes');
const { User, StudyTime } = require('../../db');
const AppError = require('../../utils/appError');
const { ClassRepo } = require('./repo');
const { REGISTRATION_ACCEPTED } = require('../../constants');
const getAllClasses = async () => {
  return await ClassRepo.findAll();
};

const createNewClass = async (req) => {
  const { name, startDate, endDate } = req.body;
  const { userId } = req;
  return await ClassRepo.create({
    name,
    startDate,
    endDate,
    createdBy: userId,
    modifiedBy: userId,
  });
};

const getClass = async (req) => {
  const { id } = req.params;
  const classRes = await ClassRepo.findById(id, [
    {
      model: User,
      as: 'students',
      through: {
        where: {
          status: REGISTRATION_ACCEPTED,
        },
        attributes: [],
      },
    },
    { model: StudyTime },
  ]);
  if (!classRes) throw new AppError('Class not found', StatusCodes.NOT_FOUND);
  return classRes;
};

const updateClass = async (req) => {
  const { id } = req.params;
  const { userId } = req;
  const { name, startDate, endDate, maxStudents } = req.body;
  const success = (
    await ClassRepo.update(
      { name, startDate, endDate, modifiedBy: userId, maxStudents },
      { id }
    )
  )[0];
  if (!success) {
    throw new AppError(
      'Class not found or update process has error',
      StatusCodes.BAD_REQUEST
    );
  }
};

const deleteClass = async (req) => {
  const { id } = req.params;
  const success = await ClassRepo.delete({ id });
  if (!success) {
    throw new AppError(
      'Class not found or delete process has error',
      StatusCodes.BAD_REQUEST
    );
  }
};

module.exports = {
  getAllClasses,
  createNewClass,
  getClass,
  updateClass,
  deleteClass,
};
