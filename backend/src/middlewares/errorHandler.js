const ApiService = require('../services/api.service');

function handleControllerError(res, error) {
	const statusCode =
		error.status && typeof parseInt(error.status) === typeof 1
			? error.status
			: 500;

	return ApiService.respond(
		res,
		{
			error: error.message,
		},
		statusCode
	);
}

module.exports = {
	handleControllerError,
};
