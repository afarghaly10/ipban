/**
 * Rate Limit resolver
 */
const {RateLimiterRedis} = require('rate-limiter-flexible');
const redis = require('../../utility/redis');
const errorHandler = require('../errorHandler');

const {ExceedLimitError} = require('@ludusity/common');
const isLimitedAccessUser = (uuid) => {
	const rateLimitedUsers = process.env.RATE_LIMIT_USERS;

	if (rateLimitedUsers?.length) {
		const uuids = rateLimitedUsers.split(',');
		if (uuids.includes(uuid)) return true;
	}
	return false;
};

const checkRateLimit = async (uuid, req) => {
	let includeTimer = true;
	const opts = {
		timeoutMs: 300,
		storeClient: redis,
		points: Number((process.env.RATE_LIMIT_POINTS) ?
			process.env.RATE_LIMIT_POINTS : 150),
		duration: Number((process.env.RATE_LIMIT_DURATION) ?
			process.env.RATE_LIMIT_DURATION : 60),
	};

	if (isLimitedAccessUser(uuid)) {
		includeTimer = false;
		opts.points = Number((process.env.RATE_LIMIT_USERS_POINTS) ?
			process.env.RATE_LIMIT_USERS_POINTS : 150);
	}

	try {
		const rateLimiter = new RateLimiterRedis(opts);

		let pointsToConsume = 1;
		if (isLimitedAccessUser(uuid)) {
			const {method, path, body} = req;
			if (
				method === 'POST' &&
				path.indexOf('responseData') !== -1 &&
				body?.sectionId
			) {
				pointsToConsume = 3;
			}
		}
		await rateLimiter.consume(uuid, pointsToConsume);
	} catch (e) {
		if (e instanceof Error) {
			errorHandler.logToSentry(e);
		} else {
			const details = (e._msBeforeNext && includeTimer) ? {msBeforeRetry: e._msBeforeNext} : {};
			throw new ExceedLimitError('RATE_LIMIT_REACHED', {user: uuid}, 'warning', details);
		}
	}
};

module.exports = async (req, res, next) => {
	if (req?.headers?.authorization && process.env.NODE_ENV !== 'test' && process.env.REDIS_HOST) {
		try {
			const authenticated = accessKey.decodeJwt(req?.headers?.authorization);

			const uuid = authenticated?.user?.uuid;

			await checkRateLimit(uuid, {
				method: req.method,
				path: req.originalUrl,
				body: req.body,
			});
			next();
		} catch (e) {
			next(e);
		}
	} else {
		next();
	}
};
