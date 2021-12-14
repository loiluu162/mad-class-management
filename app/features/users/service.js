const UsersRepo = require('./repo');

const getUsers = async function (req) {
  // const page = req.query.page || 1;
  // const limit = req.query.limit || 10;
  // var users = await User.find(query);
  return await UsersRepo.getUsers();
};
const isExistsUserId = async function (id) {
  return (await UsersRepo.getUsersById(id)) !== null;
};

const getUserById = async function (req) {
  // var users = await User.find(query);
  return await UsersRepo.getUsers();
};
const getUserByEmail = async function (req) {
  // var users = await User.find(query);
  return await UsersRepo.getUserByEmail();
};

module.exports = {
  getUsers,
  isExistsUserId,
  getUserById,
  getUserByEmail,
};
