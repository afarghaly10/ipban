'use strict';
class GenericNotFoundError extends Error {
	constructor(props, details = null, status = 'warning') {
		super(props);
		this.status = status;
		this.htmlErrorCode = 404;
		this.details = details;
	}
}
module.exports = GenericNotFoundError;
