const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUserInformation,
} = require('./controller');

router.get('/', getUsers);
router.route('/:id').get(getUserById).put(updateUserInformation);

router.get('/email/:email', getUsers);

module.exports = router;
