module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        notEmpty: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        isEmail: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      photoUrl: {
        type: DataTypes.STRING(500),
      },
      blocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      provider: {
        type: DataTypes.STRING(20),
        defaultValue: 'local',
      },
      providerId: {
        type: DataTypes.STRING,
      },
    },
    {
      defaultScope: {
        attributes: {
          exclude: [
            'password',
            'createdAt',
            'updatedAt',
            'provider',
            'providerId',
          ],
        },
      },
    }
  );

  return User;
};
