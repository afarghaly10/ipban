'use strict';

const model = require('./model');

const service = {
	create: async (body) => {
		return await model.create(body);
	},
	get: async (ip) => {
		let isBanned = true;
		const bannedIp = await model.get(ip);

		if (!bannedIp) isBanned = false;

		if (bannedIp.expiresAt && new Date(bannedIp.expiresAt) < new Date()) {
			await model.delete(ip);
			isBanned = false;
		}
		return isBanned;
	},
	list: async () => {
		return await model.list();
	},
	remove: async (ip) => {
		const result = await model.delete(ip);
		if (!result) return { error: 'IP not found' };
	},
};

module.exports = service;
