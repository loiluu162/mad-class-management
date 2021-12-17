const { UserRepo } = require('./repo');
// const { User, Token, Role } = require('../../db');

const getUsers = async function (req) {
  // const page = req.query.page || 1;
  // const limit = req.query.limit || 10;
  // var users = await User.find(query);
  return await UserRepo.findAll();
};

const getUser = async function (req) {
  const { id } = req;
  return await UserRepo.findById(id);
};

module.exports = {
  getUsers,
  getUser,
};
