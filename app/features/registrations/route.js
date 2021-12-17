const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getAllRegistrations,
  createNewRegistration,
} = require('./controller');
router.route('/').get(getAllRegistrations).post(createNewRegistration);

// router.route('/:id').get(getClass).put(updateClass).delete(deleteClass);
