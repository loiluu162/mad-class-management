const express = require('express');
const { ROLE_ADMIN } = require('../../constants');
const { hasAnyRole, verifyToken } = require('../../middlewares/verifyJwt');
const router = express.Router({ mergeParams: true });
const {
  getAllClasses,
  createNewClass,
  getClass,
  updateClass,
  deleteClass,
  deleteStudyTime,
  getAllMyClasses,
  getClassWithStatus,
} = require('./controller');

router.use(verifyToken);

router.get('/my', getAllMyClasses);
router.get('/my/:id', getClassWithStatus);
router.get('/:id', getClass);

router.use(hasAnyRole(ROLE_ADMIN));

router.route('/').get(getAllClasses).post(createNewClass);

router.route('/:id').put(updateClass).delete(deleteClass);
router.delete('/deleteStudyTime/:studyTimeId', deleteStudyTime);

module.exports = router;
