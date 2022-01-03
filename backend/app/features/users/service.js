const { UserRepo } = require('./repo');
// const { User, Token, Role } = require('../../db');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const getUsers = async function (req) {
  // const page = req.query.page || 1;
  // const limit = req.query.limit || 10;
  // var users = await User.find(query);
  return await UserRepo.findAll();
};

const getUser = async function (req) {
  const { id } = req;
  return await UserRepo.findById(id);
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

module.exports = {
  getUsers,
  getUser,
  changeAvatar,
  changeInfo,
  handleSaveAvatar,
};

function handleSaveAvatar(req) {
  if (!req.file) throw new Error('Imange required');
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
