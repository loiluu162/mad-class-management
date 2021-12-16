module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('tokens', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
    token: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    purpose: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    usedAt: {
      type: DataTypes.DATE,
    },
  });

  return Token;
};
