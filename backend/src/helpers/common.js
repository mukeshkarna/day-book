const authController = require('../controller/api/authController');

async function getLoggedInUserDetail(authorization) {
	return await authController.getUserFromToken(authorization);
}

module.exports = {
	getLoggedInUserDetail,
};
