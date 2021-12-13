const bcrypt = require('bcrypt');
const saltRounds = 10;
exports.hash = async (rawPassword) => {
  return await bcrypt.hash(rawPassword, saltRounds);
};
exports.compare = async (rawPassword, hashedPassword) => {
  return await bcrypt.compare(rawPassword, hashedPassword);
};
