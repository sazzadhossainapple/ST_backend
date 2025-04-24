const express = require('express');
const { employeeController } = require('../controller');
const { auth } = require('../middleware');

const router = express.Router();

const { index, update, destroy, store, getById } = employeeController;

// employee application routes here...

router.route('/').get(index).post(store);
router.route('/:id').get(getById).put(update).delete(destroy);

module.exports = router;
