'use strict';
class AuthenticationError extends Error {
	constructor(props, details = null, status = 'error') {
		super(props);
		this.status = status;
		this.htmlErrorCode = 403;
		this.details = details;
	}
}
module.exports = AuthenticationError;
