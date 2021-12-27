const { StatusCodes } = require('http-status-codes');
const { User, StudyTime, sequelize } = require('../../db');
const AppError = require('../../utils/appError');
const { ClassRepo } = require('./repo');
const { REGISTRATION_ACCEPTED } = require('../../constants');
const getAllClasses = async () => {
  return await ClassRepo.findAll({}, [
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
    { model: StudyTime, as: 'studyTimes' },
  ]);
};

const createNewClass = async (req) => {
  const { name, startDate, endDate, studyTimes = [] } = req.body;
  const { userId } = req;
  return await ClassRepo.create(
    {
      name,
      startDate,
      endDate,
      createdBy: userId,
      modifiedBy: userId,
      studyTimes,
    },
    {
      include: [{ model: StudyTime, as: 'studyTimes' }],
    }
  );
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
    { model: StudyTime, as: 'studyTimes' },
  ]);
  if (!classRes) throw new AppError('Class not found', StatusCodes.NOT_FOUND);
  return classRes;
};

const updateClass = async (req) => {
  const { id } = req.params;
  const { userId } = req;
  const { name, startDate, endDate, maxStudents, studyTimes } = req.body;

  const t = await sequelize.transaction();
  try {
    await ClassRepo.update(
      { name, startDate, endDate, modifiedBy: userId, maxStudents },
      { id },
      { transaction: t }
    );

    // const classRes = await ClassRepo.findById(id);
    if (studyTimes && studyTimes.length) {
      for (let i = 0; i < studyTimes.length; i++) {
        studyTimes[i].classId = id;
      }
      await StudyTime.bulkCreate(studyTimes, {
        updateOnDuplicate: ['dayInWeek', 'startTime', 'endTime', 'classId'],
        transaction: t,
      });
    }
    // await classRes.setStudyTimes(studyTimes, { transaction: t });
    await t.commit();
  } catch (err) {
    console.log(err);
    await t.rollback();
    throw Error('Some thing went wrong');
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
