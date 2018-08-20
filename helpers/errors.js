export class APIError extends Error {
	constructor (message, errorCode, ...args) {
		super(...args);
		Error.captureStackTrace(this, APIError)
		this.message = message;
		this.errorCode = errorCode;
	}
}

export class NotFoundError extends APIError {
	constructor (...args) {
		super(...args);
		this.errorCode = 404;
		this.message = this.message || 'The requested resource couldn\'t be found';
	}
}

export class BadRequestError extends APIError {
	constructor (...args) {
		super(...args);
		this.errorCode = 400;
		this.message = this.message || 'Invalid data sent';
	}
}

export class ServerError extends APIError {
	constructor (...args) {
		super(...args);
		this.errorCode = 500;
		this.message = this.message || 'Internal Server Error';
	}
}