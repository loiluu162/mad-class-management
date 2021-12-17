module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('classes', {
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
    maxStudents: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
    },
  });

  return Class;
};
