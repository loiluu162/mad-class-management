const cron = require('node-cron');
const { REGISTRATION_ACCEPTED } = require('../constants');
const { StudyTime, User } = require('../db');
const { Op } = require('sequelize');
const { ClassRepo } = require('../features/classes/repo');

const cronService = require('./service');

// clean expired token every 3 days
const EVERY_THREE_DAYS = '0 0 */3 * *';
const EVERY_MINUTE = '* * * * *';
cron.schedule(EVERY_THREE_DAYS, async () => {
  const res = await cronService.removeExpiredToken();
  console.log(`INFO: Remove ${res[0]} expired tokens`);
});

// cron.schedule(EVERY_MINUTE, async () => {
//   console.log('INFO: reminder starting..');
//   // get all classes that started and have study times startAt < now 1h
//   const ONE_HOUR_LENGTH = 60 * 60 * 1000;

//   await ClassRepo.findAll({}, [
//     {
//       model: User,
//       as: 'students',
//       through: {
//         where: {
//           status: REGISTRATION_ACCEPTED,
//         },
//         attributes: [],
//       },
//     },
//     {
//       model: StudyTime,
//       as: 'studyTimes',
//       through: {
//         where: {
//           startTime: {
//             [Op.gt]: new Date(Date.now() - ONE_HOUR_LENGTH),
//           },
//         },
//         attributes: [],
//       },
//     },
//   ]);
// });

module.exports = cron;
