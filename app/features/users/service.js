const { UserRepo } = require('./repo');
// const { User, Token, Role } = require('../../db');

const getUsers = async function (req) {
  // const page = req.query.page || 1;
  // const limit = req.query.limit || 10;
  // var users = await User.find(query);
  return await UserRepo.findAll();
};

const isExistsUserId = async function (id) {
  return (await UserRepo.findById(id)) !== null;
};

const getUserById = async function (req) {
  // var users = await User.find(query);
  const { id } = req.params;
  return await UserRepo.findById(id);
};
const getUserByEmail = async function (req) {
  // var users = await User.find(query);
  const { email } = req.params;
  return await UserRepo.findOne({ email });
};

module.exports = {
  getUsers,
  isExistsUserId,
  getUserById,
  getUserByEmail,
};
