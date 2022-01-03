const express = require('express');
const { ROLE_ADMIN } = require('../../constants');
const { verifyToken, hasAnyRole } = require('../../middlewares/verifyJwt');
const router = express.Router({ mergeParams: true });

const {
  getAllRegistrations,
  createNewRegistration,
  cancelRegistration,
  changeStatusRegistration,
  getMyRegistrations,
} = require('./controller');

router.use(verifyToken);
router.post('/', createNewRegistration);
router.post('/cancel', cancelRegistration);

router.use(hasAnyRole(ROLE_ADMIN));
router.route('/').get(getAllRegistrations);
router.route('/my').get(getMyRegistrations);
router.put('/changeStatus', changeStatusRegistration);

module.exports = router;
