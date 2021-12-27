const express = require('express');
const { verifyToken } = require('../../middlewares/verifyJwt');
const router = express.Router();

const { getUser, updateUser, changeAvatar } = require('./controller');

// router.get('/', getUsers);
const multer = require('multer');
// {
//     fileFilter: function (req, file, cb) {
//       if (file.mimetype !== 'image/png') {
//         return cb(null, false, new Error('Only image type allowed'));
//       }
//       cb(null, true);
//     },
//   }
const fileUpload = multer();

router.use(verifyToken);
router.route('/').get(getUser).put(updateUser);

router.post('/changeAvatar', fileUpload.single('avatar'), changeAvatar);

// router.get('/email/:email', getUsers);

module.exports = router;
