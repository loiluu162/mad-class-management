const { databaseConnectionString } = require('../config');

const { Sequelize, DataTypes } = require('sequelize');

console.log(databaseConnectionString);
const sequelize = new Sequelize(databaseConnectionString);

const User = require('../features/users/user')(sequelize, DataTypes);

(async () => {
  try {
    await sequelize.authenticate();
    await User.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = { sequelize, User };

// const sequelize = new Sequelize(
//   config.DB,
//   config.USER,
//   config.PASSWORD,
//   {
//     host: config.HOST,
//     dialect: config.dialect,
//     operatorsAliases: false,

//     pool: {
//       max: config.pool.max,
//       min: config.pool.min,
//       acquire: config.pool.acquire,
//       idle: config.pool.idle
//     }
//   }
// );
