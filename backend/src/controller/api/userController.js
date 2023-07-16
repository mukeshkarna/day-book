const { OAuthUser, Role } = require('../../models');

const ApiService = require('../../services/api.service');

const { UNAUTHORIZED, OK } = require('../../constants/statusCode');
const { UNAUTHORIZED_USER } = require('../../constants/flashMessages');

const apiAuthController = require('./authController');

let userController = {
	currentUser: async (req, res, next) => {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			// No Authorization header provided
			return ApiService.respond(
				res,
				{ error: UNAUTHORIZED_USER },
				UNAUTHORIZED
			);
		}
		const parts = authHeader.split(' ');
		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			// Invalid Authorization header format
			return ApiService.respond(
				res,
				{ error: UNAUTHORIZED_USER },
				UNAUTHORIZED
			);
		}
		const accessToken = parts[1];
		// Validate the access token
		const token = await apiAuthController.getAccessToken(accessToken);
		if (!token) {
			// Invalid access token
			return ApiService.respond(
				res,
				{ error: UNAUTHORIZED_USER },
				UNAUTHORIZED
			);
		}

		// Retrieve the user data from the user store
		const user = await OAuthUser.findOne(
			{ email: token.user.email, deletedAt: null },
			{
				password: 0,
				otp: 0,
				otpCreateTime: 0,
			}
		);

		if (!user) {
			// User not found
			return ApiService.respond(
				res,
				{ error: UNAUTHORIZED_USER },
				UNAUTHORIZED
			);
		}

		return ApiService.respond(res, { user }, OK);
	},
};

module.exports = userController;
