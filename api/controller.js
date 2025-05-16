'use strict';

const service = require('./service');
const validator = require('./validation');

const controller = {
	create: async (req, res, next) => {
		try {
			await validator.daoInsertIp(req.body);
			// 	const { error } = validateIp(ip);
			// 	if (error) return res.status(400).json({ error: error.details[0].message });
			await service.create(req.body);

			res.status(201).json({ message: 'IP banned successfully' });
		} catch (error) {
			res.status(500).json({ error: 'Failed to ban IP' });
			next(error);
		}
	},
	get: async (req, res, next) => {
		try {
			const { ip } = req.params;
			await validator.daoValidateIp(ip);
			const isBanned = await service.get(ip);
			const response = {
				ip,
				isBanned,
			};
			res.json(response);
		} catch (error) {
			res.status(500).json({ error: 'Failed to check IP status' });
			next(error);
		}
	},
	list: async (req, res, next) => {
		try {
			const response = await service.list();
			res.json(response);
		} catch (error) {
			res.status(500).json({ error: 'Failed to retrieve banned IPs' });
			next(error);
		}
	},
	remove: async (req, res, next) => {
		try {
			const { ip } = req.params;
			await validator.daoValidateIp(ip);

			await service.remove(ip);

			res.json({ message: 'IP unbanned successfully' });
		} catch (error) {
			res.status(500).json({ error: 'Failed to unban IP' });
			next(error);
		}
	},
};

module.exports = controller;
