const { body } = require('express-validator');
const { ClassRepo } = require('../classes/repo');
const { RegistrationRepo } = require('./repo');

const AppError = require('../../utils/appError');

const { StatusCodes } = require('http-status-codes');
const { REGISTRATION_ACCEPTED } = require('../../constants');

exports.validate = (method) => {
  switch (method) {
    case 'createRegistration': {
      return [
        body('classId', 'Class id required for registration').exists(),
        body('classId').custom(async (classId) => validateClass(classId)),
      ];
    }
    case 'changeStatus': {
      return (req, res, next) => {
        const { classId } = req.params;
        validateClass(classId);
        next();
      };
    }
  }
};

const validateClass = async (classId) => {
  const registrationClass = await ClassRepo.findById(classId);

  if (!registrationClass) {
    throw new AppError('Class not found', StatusCodes.BAD_REQUEST);
  }

  const { maxStudents } = registrationClass;

  const currentAcceptedStudents = (
    await RegistrationRepo.findAll({
      classId: classId,
      status: REGISTRATION_ACCEPTED,
    })
  ).length;

  if (maxStudents === currentAcceptedStudents) {
    throw new AppError(
      'Class already accepted maximum students',
      StatusCodes.BAD_REQUEST
    );
  }
};
