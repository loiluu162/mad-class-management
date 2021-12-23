const { databaseConnectionString } = require('../config');

const { Sequelize } = require('sequelize');
const { REGISTRATION_PENDING, ROLE_USER, ROLE_ADMIN } = require('../constants');

const sequelize = new Sequelize(databaseConnectionString);

const User = require('../features/users/user')(sequelize, Sequelize);
const Role = require('../features/users/role')(sequelize, Sequelize);
const Token = require('../features/users/token')(sequelize, Sequelize);
const Class = require('../features/classes/class')(sequelize, Sequelize);
const StudyTime = require('../features/classes/studyTime')(
  sequelize,
  Sequelize
);

const UserRole = sequelize.define('userRole', {}, { timestamps: false });

const Registration = sequelize.define(
  'registrations',
  {
    status: {
      type: Sequelize.STRING(20),
      defaultValue: REGISTRATION_PENDING,
    },
  },
  { timestamps: true }
);

Class.belongsToMany(User, {
  through: Registration,
  foreignKey: 'classId',
  otherKey: 'userId',
  as: 'students',
});

User.belongsToMany(Class, {
  through: Registration,
  foreignKey: 'userId',
  otherKey: 'classId',
});

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

Class.hasMany(StudyTime);
StudyTime.belongsTo(Class);

(async () => {
  try {
    await sequelize.authenticate();
    await User.sync();
    await Role.sync();
    await UserRole.sync();
    await Token.sync();
    await Role.findOrCreate({
      where: { name: ROLE_USER },
    });
    await Role.findOrCreate({
      where: { name: ROLE_ADMIN },
    });
    await Class.sync();
    await Registration.sync();
    await StudyTime.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = {
  sequelize,
  User,
  Role,
  Token,
  Class,
  StudyTime,
  Registration,
};

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