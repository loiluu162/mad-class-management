const { StatusCodes } = require('http-status-codes');
const {
  REGISTRATION_PENDING,
  REGISTRATION_CANCELED,
  REGISTRATION_ACCEPTED,
  REGISTRATION_REJECTED,
} = require('../../constants');

const {
  sendAcceptationEmail,
  sendRejectionEmail,
} = require('../../utils/email');

const AppError = require('../../utils/appError');
const { RegistrationRepo } = require('./repo');
const { Op } = require('sequelize');

const getAllRegistrations = async () => {
  return await RegistrationRepo.findAll();
};

const createNewRegistration = async (req) => {
  const { classId } = req.body;
  const { userId } = req;

  // TODO: check number of students registered
  const registration = await RegistrationRepo.findOne({
    userId,
    classId,
  });

  if (registration) {
    if (registration.status !== REGISTRATION_CANCELED) {
      throw new AppError(
        'You had already registered this class',
        StatusCodes.BAD_REQUEST
      );
    }
    return await RegistrationRepo.update(
      { status: REGISTRATION_PENDING },
      { userId, classId }
    );
  }

  await RegistrationRepo.create({ userId, classId });
};

const cancelRegistration = async (req) => {
  const { classId } = req.params;
  const success = (
    await RegistrationRepo.update(
      { status: REGISTRATION_CANCELED },
      { classId, status: REGISTRATION_PENDING }
    )
  )[0];
  if (!success) {
    throw new AppError(
      'Registration is not found or not in pending',
      StatusCodes.BAD_REQUEST
    );
  }
};

const changeStatusRegistration = async (req) => {
  const { status, classId, userId } = req.body;
  const success = (
    await RegistrationRepo.update(
      { status },
      {
        userId,
        classId,
        status: {
          [Op.not]: REGISTRATION_CANCELED,
        },
      }
    )
  )[0];
  if (!success) {
    throw new AppError(
      'Registration is not found or not canceled',
      StatusCodes.BAD_REQUEST
    );
  }
  if (status === REGISTRATION_ACCEPTED) {
    // await EmailUtils.send
    // await sendAcceptationEmail(to);
  }
  if (status === REGISTRATION_REJECTED) {
    // await EmailUtils.send
    // await sendRejectionEmail(to);

  }
  return success;
};

module.exports = {
  getAllRegistrations,
  createNewRegistration,
  cancelRegistration,
  changeStatusRegistration,
};