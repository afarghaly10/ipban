'use strict';
class ValidationError extends Error {
	constructor(props, details = null, status = 'error') {
		super(props);
		this.status = status;
		this.htmlErrorCode = 400;
		this.details = details;
	}
}

module.exports = ValidationError;
