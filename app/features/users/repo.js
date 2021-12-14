const { User, Token } = require('../../db');

const getUsers = async () => {
  const users = await User.findAll();
  return users;
};

const getUserById = async (id) => {
  const users = await User.findOne();
  return users;
};

const getUserByEmail = async (email) => {
  const users = await User.findOne({
    where: {
      email: email,
    },
  });
  return users;
};

const isExistsEmail = async (email) => {
  return (
    (await User.findOne({
      where: {
        email: email,
      },
    })) != null
  );
};

const blockAccount = async (email) => {
  await User.update(
    { blocked: true },
    {
      where: {
        email: email,
      },
    }
  );
};
// const enableAccount = async (email) => {
//   return await User.update(
//     { enabled: true },
//     {
//       where: {
//         email: email,
//       },
//     }
//   );
// };

const isExistsUserId = async (id) => {
  return (
    (await User.findOne({
      where: {
        id: id,
      },
    })) != null
  );
};

const registerNewAccount = async (email, name, password) => {
  const newAccount = await User.create({
    email,
    name,
    password,
  });
  return newAccount.id;
};

const createToken = async (userId, token, purpose) => {
  return (await Token.create({ userId, token, purpose })).token;
};

const getValidToken = async (token, purpose) => {
  // const result = await Token.findAll(
  //   'SELECT * FROM tokens WHERE token = $1 AND purpose=$2 AND expires_at > now() AND token_used_at IS NULL ORDER BY id DESC',
  //   [token, purpose]
  // );
  return (
    (await Token.findOne({
      where: {
        token,
        purpose,
      },
    })) != null
  );
};
const verifyUser = async (userId) => {
  return await User.update(
    { enabled: true },
    {
      where: {
        id: userId,
      },
    }
  );
};
const markTokenUsed = async (id) => {
  return await Token.update(
    { token_used_at: new Date() },
    {
      where: {
        id,
      },
    }
  );
  // return (
  //   (
  //     await User.query(
  //       'UPDATE tokens SET token_used_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING id',
  //       [id]
  //     )
  //   ).rows.length > 0
  // );
};

const resetPassword = async (userId, newHashedPassword) => {
  return await User.update(
    { password: newHashedPassword },
    {
      where: {
        id: userId,
      },
    }
  );
  // return (
  //   (
  //     await User.query(
  //       'UPDATE users SET password=$1 WHERE id=$2 RETURNING id',
  //       [newHashedPassword, userId]
  //     )
  //   ).rows.length > 0
  // );
};

const isCurrentPasswordValid = async (userId, currentHashedPassword) => {
  return (
    (
      await User.findAll({
        where: {
          id: userId,
          password: currentHashedPassword,
        },
      })
    ).length > 0
  );
  // return (
  //   (
  //     await User.query('SELECT * FROM users where id = $1 AND password= $2', [
  //       userId,
  //       currentHashedPassword,
  //     ])
  //   ).rows.length > 0
  // );
};

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  isExistsEmail,
  blockAccount,
  isExistsUserId,
  registerNewAccount,
  createToken,
  getValidToken,
  verifyUser,
  markTokenUsed,
  resetPassword,
  isCurrentPasswordValid,
};
