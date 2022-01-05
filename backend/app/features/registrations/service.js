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
  sendRegistrationEmail,
} = require('../../utils/email');

const AppError = require('../../utils/appError');
const { RegistrationRepo } = require('./repo');
const { Op, QueryTypes } = require('sequelize');
const { UserRepo } = require('../users/repo');
const { sequelize } = require('../../db');

const getAllRegistrations = async () => {
  // const registrations = await RegistrationRepo.findAll({}, [{ model: User }]);
  const query =
    'SELECT r.*, c.name as "className", u.name as "userFullName", u.email FROM registrations r inner join users u on r."userId" = u.id inner join classes c on r."classId" = c.id order by r."classId", r."userId"';
  const registrations = await sequelize.query(query, {
    bind: { status: 'active' },
    type: QueryTypes.SELECT,
  });
  return registrations;
};
const getMyRegistrations = async (req) => {
  // const registrations = await RegistrationRepo.findAll({}, [{ model: User }]);
  const { userId } = req;
  const query =
    'SELECT r.*, c.name as "className", u.name as "userFullName", u.email FROM registrations r inner join users u on r."userId" = u.id inner join classes c on r."classId" = c.id where r."userId" = $userId order by r."classId", r."userId"';
  const registrations = await sequelize.query(query, {
    bind: { userId: userId },
    type: QueryTypes.SELECT,
  });
  return registrations;
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
    await RegistrationRepo.update(
      { status: REGISTRATION_PENDING },
      { userId, classId }
    );
  } else {
    await RegistrationRepo.create({ userId, classId });
  }

  // send email

  const { email } = await UserRepo.findById(userId);

  sendRegistrationEmail(email);
};

const cancelRegistration = async (req) => {
  const { classId } = req.body;
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

  const { email } = await UserRepo.findById(userId);

  if (status === REGISTRATION_ACCEPTED) {
    sendAcceptationEmail(email, 'ACCEPT NE');
  }

  if (status === REGISTRATION_REJECTED) {
    sendRejectionEmail(email, 'REJECT NE');
  }
  return success;
};

module.exports = {
  getAllRegistrations,
  createNewRegistration,
  cancelRegistration,
  changeStatusRegistration,
  getMyRegistrations,
};
