'use strict';

const router = require('express').Router();
const controller = require('./controller');

router.route('/ban').post(controller.create).get(controller.list);

router.route('/ban/:ip').get(controller.get).delete(controller.remove);

module.exports = router;
