const cron = require('node-cron');

const cronService = require('./service');

// clean expired token every 3 days

cron.schedule('0 0 */3 * *', async () => {
  const res = await cronService.removeExpiredToken();
  console.log(`INFO: Remove ${res[0]} expired tokens`);
});

module.exports = cron;
