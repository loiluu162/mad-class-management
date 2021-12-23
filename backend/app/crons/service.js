const { Token } = require('../db');
const { Op } = require('sequelize');
const reminder = () => {
  console.log('i am reminder');
};

const removeExpiredToken = async () => {
  return await Token.destroy({
    where: {
      expiresAt: {
        [Op.gt]: new Date(),
      },
    },
  });
};

module.exports = { reminder, removeExpiredToken };
