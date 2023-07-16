const { validationResult } = require('express-validator');

const { UNPROCESSABLE_ENTITY } = require('../constants/statusCode');

const ApiService = require('../services/api.service');

const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return ApiService.respond(
			res,
			{ errors: errors.array() },
			UNPROCESSABLE_ENTITY
		);
	}
	next();
};

module.exports = {
	handleValidationErrors,
};
