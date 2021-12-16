const { databaseConnectionString } = require('../config');

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(databaseConnectionString);

const User = require('../features/users/user')(sequelize, Sequelize);
const Role = require('../features/users/role')(sequelize, Sequelize);
const Token = require('../features/users/token')(sequelize, Sequelize);

const UserRole = sequelize.define('user_role', {}, { timestamps: false });

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'roleId',
  otherKey: 'userId',
});

User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'userId',
  otherKey: 'roleId',
});

Token.belongsTo(User, {
  foreignKey: 'userId',
  targetKey: 'id',
});
User.hasOne(Token, {
  foreignKey: 'userId',
  targetKey: 'id',
});

(async () => {
  try {
    await sequelize.authenticate();
    await User.sync();
    await Role.sync();
    await UserRole.sync();
    await Token.sync();
    await Role.findOrCreate({
      where: { name: 'ROLE_USER' },
    });
    await Role.findOrCreate({
      where: { name: 'ROLE_ADMIN' },
    });
    await Role.findOrCreate({
      where: { name: 'ROLE_TEACHER' },
    });
    // await User.sync({ force: true });
    // console.log(await User.findAll());
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = { sequelize, User, Role, Token };

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
