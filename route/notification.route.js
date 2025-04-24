const express = require('express');
const { notificationController } = require('../controller');

const router = express.Router();

const { index, update, destroy, store, getById } = notificationController;

// Notification application routes here...

router.route('/').get(index).post(store);

router.route('/:id').get(getById).put(update).delete(destroy);

module.exports = router;
