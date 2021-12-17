const express = require('express');
const { ROLE_ADMIN } = require('../../constants');
const { verifyToken, hasAnyRole } = require('../../middlewares/verifyJwt');
const router = express.Router({ mergeParams: true });

const {
  getAllRegistrations,
  createNewRegistration,
  cancelRegistration,
  changeStatusRegistration,
} = require('./controller');

router.use(verifyToken);
router.post('/', createNewRegistration);
router.post('/cancel/:classId', cancelRegistration);

router.use(hasAnyRole(ROLE_ADMIN));
router.route('/').get(getAllRegistrations);
router.put('/changeStatus/:classId', changeStatusRegistration);

module.exports = router;
