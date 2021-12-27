module.exports = (sequelize, DataTypes) => {
  const StudyTime = sequelize.define(
    'studyTimes',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      dayInWeek: {
        type: DataTypes.STRING(30),
        allowNull: false,
        notEmpty: true,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  return StudyTime;
};
