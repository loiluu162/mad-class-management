const { User, Token, Role } = require('../../db');

const UserRepo = new (require('../../db/baseRepo'))(User);
const TokenRepo = new (require('../../db/baseRepo'))(Token);
const RoleRepo = new (require('../../db/baseRepo'))(Role);

// const { Op } = require('sequelize');

// const getUsers = async () => {
//   const users = await User.findAll();
//   return users;
// };

// const getUserById = async (id) => {
//   const users = await User.findOne();
//   return users;
// };

// const getUserByEmail = async (email) => {
//   const users = await User.findOne({
//     where: {
//       email: email,
//     },
//   });
//   return users;
// };

// const isExistsEmail = async (email) => {
//   return (
//     (await User.findOne({
//       where: {
//         email: email,
//       },
//     })) != null
//   );
// };

// const blockAccount = async (email) => {
//   await User.update(
//     { blocked: true },
//     {
//       where: {
//         email: email,
//       },
//     }
//   );
// };

// const isExistsUserId = async (id) => {
//   return (
//     (await User.findOne({
//       where: {
//         id: id,
//       },
//     })) != null
//   );
// };

// const registerNewAccount = async (
//   email,
//   name,
//   password,
//   roles = ['ROLE_USER']
// ) => {
//   const newAccount = await User.create({
//     email,
//     name,
//     password,
//   });
//   const rolesData = await Role.findAll({
//     where: {
//       name: {
//         [Op.or]: roles,
//       },
//     },
//   });
//   await newAccount.setRoles(rolesData);
//   return newAccount.id;
// };

// const createToken = async (userId, token, purpose) => {
//   return (await Token.create({ userId, token, purpose })).token;
// };

// const getValidToken = async (token, purpose) => {
//   return (
//     (await Token.findOne({
//       where: {
//         token,
//         purpose,
//       },
//     })) != null
//   );
// };
// const verifyUser = async (userId) => {
//   return await User.update(
//     { enabled: true },
//     {
//       where: {
//         id: userId,
//       },
//     }
//   );
// };
// const markTokenUsed = async (id) => {
//   return await Token.update(
//     { token_used_at: new Date() },
//     {
//       where: {
//         id,
//       },
//     }
//   );
// };

// const resetPassword = async (userId, newHashedPassword) => {
//   return await User.update(
//     { password: newHashedPassword },
//     {
//       where: {
//         id: userId,
//       },
//     }
//   );
// };

// const isCurrentPasswordValid = async (userId, currentHashedPassword) => {
//   return (
//     (
//       await User.findAll({
//         where: {
//           id: userId,
//           password: currentHashedPassword,
//         },
//       })
//     ).length > 0
//   );
//   // return (
//   //   (
//   //     await User.query('SELECT * FROM users where id = $1 AND password= $2', [
//   //       userId,
//   //       currentHashedPassword,
//   //     ])
//   //   ).rows.length > 0
//   // );
// };

// module.exports = {
//   getUsers,
//   getUserById,
//   getUserByEmail,
//   isExistsEmail,
//   blockAccount,
//   isExistsUserId,
//   registerNewAccount,
//   createToken,
//   getValidToken,
//   verifyUser,
//   markTokenUsed,
//   resetPassword,
//   isCurrentPasswordValid,
// };

module.exports = { UserRepo, TokenRepo, RoleRepo };
