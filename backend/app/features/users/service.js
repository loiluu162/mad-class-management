const { UserRepo, RoleRepo } = require('./repo');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { Role, sequelize } = require('../../db');
const { ROLE_ADMIN, ROLE_USER } = require('../../constants');
const { PasswordUtils, catchValidationError } = require('../../utils');
const { Op } = require('sequelize');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const getUsers = async function (req) {
  return (
    await UserRepo.findAll(null, [{ model: Role, attributes: ['name'] }])
  ).filter((user) => !user.roles.some(({ name }) => name === ROLE_ADMIN));
};

const getUser = async function (req) {
  const { id } = req.params;
  return await UserRepo.findById(id, [{ model: Role, attributes: ['name'] }]);
};
const createNewUser = async function (req) {
  catchValidationError(req);

  const { name, password, email, roles = [ROLE_USER] } = req.body;
  // encrypt password
  const hashedPw = await PasswordUtils.hash(password);
  const t = await sequelize.transaction();
  try {
    const newUser = await UserRepo.create(
      {
        email,
        name,
        password: hashedPw,
      },
      { transaction: t }
    );
    const rolesData = await RoleRepo.findAll({
      name: {
        [Op.or]: roles,
      },
    });
    await newUser.setRoles(rolesData, { transaction: t });
    // create token
    await t.commit();
    // send email
  } catch (err) {
    await t.rollback();
    throw new Error('Something went wrong');
  }
};
const changeAvatar = async function (req) {
  const { id } = req;
  return await UserRepo.findById(id);
};
const changeInfo = async function (req) {
  const { userId } = req;
  const data = req.body;
  await UserRepo.update(data, { id: userId }, { returning: true, plain: true });
  return await UserRepo.findById(userId);
};

const blockUser = async function (req) {
  const { blocked, userId } = req.body;
  await UserRepo.update({ blocked }, { id: userId });
  return await UserRepo.findById(userId);
};
function handleSaveAvatar(req) {
  if (!req.file) throw new Error('Image required');
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        }
        reject(error);
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    const { userId } = req;

    const result = await streamUpload(req);
    const newAvatar = result.secure_url;
    await UserRepo.update({ photoUrl: newAvatar }, { id: userId });
    return newAvatar;
  }

  return upload(req);
}
module.exports = {
  getUsers,
  getUser,
  changeAvatar,
  changeInfo,
  handleSaveAvatar,
  createNewUser,
  blockUser,
};
