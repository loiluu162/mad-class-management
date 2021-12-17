const express = require('express');
const { ROLE_ADMIN } = require('../../constants');
const { hasAnyRole } = require('../../middlewares/verifyJwt');
const router = express.Router({ mergeParams: true });
const {
  getAllClasses,
  createNewClass,
  getClass,
  updateClass,
  deleteClass,
} = require('./controller');

router.get('/:id', getClass);

router.use(hasAnyRole(ROLE_ADMIN));

router.route('/').get(getAllClasses).post(createNewClass);

router.route('/:id').put(updateClass).delete(deleteClass);

module.exports = router;
