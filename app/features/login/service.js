const UserRepo = require('../users/repo');
const {
  PasswordUtils,
  TokenUtils,
  EmailUtils,
  catchValidationError,
} = require('../../utils');

const {
  EMAIL_CONFIRMATION_PURPOSE,
  PASSWORD_RESET_PURPOSE,
} = require('../../constants');

const login = async (req) => {
  catchValidationError(req);
  const { email, password } = req.body;
  const user = await UserRepo.getUserByEmail(email);
  if (!user) throw Error('User not found');
  if (!user.enabled) {
    throw Error('User not verified. Please check your email for confirmation');
  }
  const pwMatch = await PasswordUtils.compare(password, user.password);
  if (pwMatch) {
    // setUserAuthenticated(req, user);
    return true;
  }
  throw Error('Password wrong');
};

const signup = async (req) => {
  catchValidationError(req);
  const { name, password, email } = req.body;
  // encrypt password
  const hashedPw = await PasswordUtils.hash(password);
  // save on db
  const newUserId = await UserRepo.registerNewAccount(email, name, hashedPw);
  // create token
  const token = await createVerificationToken(newUserId);
  // send email
  await EmailUtils.sendVerification(email, token);

  // req.session.email = email;
  // req.session.userId = newUserId;
};

const isExistsEmail = async (email) => {
  return await UserRepo.isExistsEmail(email);
};

const createVerificationToken = async (userId) => {
  const token = await TokenUtils.generate();
  return await UserRepo.createToken(userId, token, EMAIL_CONFIRMATION_PURPOSE);
};

const createPasswordResetToken = async (userId) => {
  const token = await TokenUtils.generate();
  return await UserRepo.createToken(userId, token, PASSWORD_RESET_PURPOSE);
};

const verifyEmail = async (req) => {
  catchValidationError(req);

  const { code } = req.body;

  const { userId, id } = await UserRepo.getValidToken(
    code,
    EMAIL_CONFIRMATION_PURPOSE
  );
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
  const { userId, id } = await UserRepo.getValidToken(
    code,
    PASSWORD_RESET_PURPOSE
  );
  // const user = await UserRepo.getUserById(userId);

  // setUserAuthenticated(req, user);

  // mark token used
  await UserRepo.markTokenUsed(id);

  // user not enabled
  if (!(await UserRepo.isExistsUserId(userId))) {
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
