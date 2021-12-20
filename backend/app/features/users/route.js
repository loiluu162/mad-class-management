const express = require('express');
const { verifyToken } = require('../../middlewares/verifyJwt');
const router = express.Router();

const { getUser, updateUser } = require('./controller');

// router.get('/', getUsers);

router.use(verifyToken);
router.route('/').get(getUser).put(updateUser);

// router.get('/email/:email', getUsers);

module.exports = router;
