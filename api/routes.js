'use strict';

const router = require('express').Router();
const controller = require('./controller');

router.route('/ban').post(controller.create).get(controller.list);

router.route('/ban/:ip').get(controller.get).delete(controller.remove);

module.exports = router;

// POST http://localhost:3000/api/ban
// {
//   "ip": "192.168.1.100",
//   "reason": "Brute force attack",
//   "expires_at": "2025-01-01T00:00:00Z"
// }

// check
// GET http://localhost:3000/api/ban/192.168.1.100
// list
// GET http://localhost:3000/api/ban
