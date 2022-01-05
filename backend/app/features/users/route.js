const express = require('express');
const { verifyToken, hasAnyRole } = require('../../middlewares/verifyJwt');
const router = express.Router({ mergeParams: true });
const Validator = require('../login/validator');

const {
  getUser,
  changeAvatar,
  changeInfo,
  createNewUser,
  getUsers,
  blockUser,
} = require('./controller');

const multer = require('multer');
const { ROLE_ADMIN } = require('../../constants');

const fileUpload = multer();

router.use(verifyToken);

router.post('/changeAvatar', fileUpload.single('avatar'), changeAvatar);
router.post('/changeInfo', changeInfo);

router.use(hasAnyRole(ROLE_ADMIN));
router
  .route('/')
  .get(getUsers)
  .post(Validator.validate('signup'), createNewUser);
router.route('/:id').get(getUser);
router.route('/block').post(blockUser);

// router.get('/email/:email', getUsers);

module.exports = router;
