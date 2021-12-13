const express = require('express');
const router = express.Router();

const UserController = require('./controller');

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUsers);
router.get('/email/:email', UserController.getUsers);

module.exports = router;