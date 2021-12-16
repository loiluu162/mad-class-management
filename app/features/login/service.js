const { UserRepo, TokenRepo, RoleRepo } = require('../users/repo');
const { sequelize } = require('../../db');
const { Op } = require('sequelize');
const { v4: uuid } = require('uuid');
const {
  PasswordUtils,
  TokenUtils,
  EmailUtils,
  catchValidationError,
} = require('../../utils');

const {
  EMAIL_CONFIRMATION_PURPOSE,
  PASSWORD_RESET_PURPOSE,
  ROLE_USER,
  REFRESH_TOKEN_PURPOSE,
} = require('../../constants');
const { generateAccessToken } = require('../../utils/token');

const login = async (req) => {
  catchValidationError(req);
  const { email, password } = req.body;
  const user = await UserRepo.findOne({ email });
  if (!user) throw Error('User not found');
  if (!user.enabled) {
    throw Error('User not verified. Please check your email for confirmation');
  }
  const pwMatch = await PasswordUtils.compare(password, user.password);
  if (!pwMatch) {
    throw Error('Password wrong');
  }
  const accessToken = generateAccessToken(user.id);
  const refreshToken = getRefreshToken(user.id);
  const authorities = (await user.getRoles()).map((role) => role.name);
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: authorities,
    accessToken,
    refreshToken,
  };
};

const signup = async (req) => {
  catchValidationError(req);
  const { name, password, email, roles = [ROLE_USER] } = req.body;
  // encrypt password
  const hashedPw = await PasswordUtils.hash(password);
  const t = await sequelize.transaction();
  try {
    const newUser = await UserRepo.create(
      {
        email,
        name,
        password: hashedPw,
      },
      { transaction: t }
    );
    const rolesData = await RoleRepo.findAll({
      name: {
        [Op.or]: roles,
      },
    });
    await newUser.setRoles(rolesData, { transaction: t });
    // create token
    const token = await createVerificationToken(newUser.id, { transaction: t });

    await t.commit();

    // send email
    await EmailUtils.sendVerification(email, token);
  } catch (err) {
    await t.rollback();
    throw new Error('Something went wrong');
  }
};

const isExistsEmail = async (email) => {
  return await UserRepo.isExistsEmail(email);
};

const createVerificationToken = async (userId, options = {}) => {
  const token = await TokenUtils.generate();
  const expiresAt = new Date();

  expiresAt.setSeconds(expiresAt.getSeconds() + 10000000);
  return await TokenRepo.create(
    {
      userId,
      token,
      purpose: EMAIL_CONFIRMATION_PURPOSE,
      expiresAt,
    },
    options
  );
};

const createPasswordResetToken = async (userId, options = {}) => {
  const token = await TokenUtils.generate();
  const expiresAt = new Date();

  expiresAt.setSeconds(expiresAt.getSeconds() + 10000000);
  return await TokenRepo.create(
    {
      userId,
      token,
      purpose: PASSWORD_RESET_PURPOSE,
      expiresAt,
    },
    options
  );
};

const verifyEmail = async (req) => {
  catchValidationError(req);

  const { code } = req.body;

  const { userId, id } = await TokenRepo.findOne({
    token: code,
    purpose: EMAIL_CONFIRMATION_PURPOSE,
    expiresAt: { [Op.lt]: new Date() },
    usedAt: { [Op.eq]: null },
  });
  // const user = await UserRepo.getUserById(userId);
  // setUserAuthenticated(req, user);

  await UserRepo.verifyUser(userId);
  return await UserRepo.markTokenUsed(id);
};

const verifyPasswordResetToken = async (req) => {
  catchValidationError(req);

  return true;
};

const resetPassword = async (req) => {
  catchValidationError(req);

  const { code, newPassword } = req.body;
  // hash password
  const hashedPw = PasswordUtils.hash(newPassword);
  const { userId, id } = await TokenRepo.findOne({
    token: code,
    purpose: PASSWORD_RESET_PURPOSE,
    expiresAt: { [Op.lt]: new Date() },
    usedAt: { [Op.eq]: null },
  });
  // const user = await UserRepo.getUserById(userId);

  // setUserAuthenticated(req, user);

  // mark token used
  await UserRepo.markTokenUsed(id);

  // user not enabled
  if (!(await UserRepo.findById(userId))) {
    await UserRepo.verifyUser(userId);
  }
  // change password
  return await UserRepo.resetPassword(userId, hashedPw);
};

const requestForgotPassword = async (req) => {
  catchValidationError(req);

  req.session.forgotPassword = true;
  const { email } = req.body;
  const user = await UserRepo.getUserByEmail(email);
  const token = await createPasswordResetToken(user.id);
  return await EmailUtils.sendPasswordReset(email, token);
};

const changePassword = async (req) => {
  catchValidationError(req);

  const { newPassword } = req.body;
  const { userId } = req.session;

  const hashedNewPassword = await PasswordUtils.hash(newPassword);

  return UserRepo.resetPassword(userId, hashedNewPassword);
};

const getRefreshToken = async (userId) => {
  const refreshToken = await TokenRepo.findOne({
    userId: userId,
    purpose: REFRESH_TOKEN_PURPOSE,
    expiresAt: { [Op.lt]: new Date() },
  });
  if (!refreshToken) {
    const expiresAt = new Date();

    expiresAt.setSeconds(expiresAt.getSeconds() + 10000000);

    const token = uuid();
    await TokenRepo.create({
      token,
      purpose: REFRESH_TOKEN_PURPOSE,
      expiresAt,
      userId: userId,
    });
    return token;
  }
  return refreshToken.token;
};
// const setUserAuthenticated = (req, user) => {
//   // TODO: I dont know why this is not working, it take me a hour to find out error happened here
//   // req.session = {
//   //   ...req.session,
//   //   loggedIn: true,
//   //   email: user.email,
//   //   userId: user.id,
//   //   photoUrl: user.photo_url,
//   // };
//   // req.session.loggedIn = true;
//   // req.session.email = user.email;
//   // req.session.userId = user.id;
//   // req.session.photoUrl = user.photo_url;
// };
// const setTokenCookie = (res, token) => {
//   // create http only cookie with refresh token that expires in 7 days
//   const cookieOptions = {
//     httpOnly: true,
//     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//   };
//   res.cookie('refreshToken', token, cookieOptions);
// };

module.exports = {
  login,
  signup,
  isExistsEmail,
  createVerificationToken,
  createPasswordResetToken,
  verifyEmail,
  resetPassword,
  verifyPasswordResetToken,
  requestForgotPassword,
  changePassword,
};
