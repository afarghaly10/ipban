const {db} = require('@ludusity/common');

module.exports = {
	response: (res, err, rows) => {
		if (err) {
			if (err.htmlErrorCode) {
				res.status(err.htmlErrorCode);
			}
			res.json(err);
		} else {
			res.json(rows); // 200
		}
	},
	log: async (req) => {
		try {
			let userId = '';
			if (req.headers.authorization) {
				const token = req.headers.authorization.replace('Bearer ', '');
				const jwt = await AccessKey.decodeJwt(token);
				userId = jwt && jwt.user && jwt.user.uuid ? jwt.user.uuid : '';
			}

			if (process.env.NODE_ENV !== 'production') {
				const os = require('os');
				userId = os.userInfo().username || '';
			}

			const ip =
				(req.headers['x-forwarded-for'] || '').split(',').pop() ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				req.connection.socket.remoteAddress ||
				'';

			const request = {};
			await Object.assign(request, req.body);
			if (request) {
				if (request.password) delete request.password;
				if (request.confirmPassword) delete request.confirmPassword;
			}

			await db.run(
				db
					.insert()
					.into('EndpointLog')
					.values({
						requestBody: JSON.stringify(request),
						endpoint: req.originalUrl,
						ipAddress: ip,
						method: req.method,
						userId,
					})
			);
		} catch (e) {
			// console.error('ENDPOINTLOG_ERROR', e);
		}
	},
	formatError: (message, status, htmlErrorCode) => {
		return {
			message,
			status,
			htmlErrorCode,
		};
	},
};
