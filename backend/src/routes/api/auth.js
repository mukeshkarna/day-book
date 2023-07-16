const express = require('express');
const router = express.Router();

const OauthController = require('../../controller/api/authController');


const OAuthServer = require('express-oauth-server');

router.oauth = new OAuthServer({
	model: OauthController,
	accessTokenLifetime: 30 * 24 * 60 * 60,
	refreshTokenLifetime: 30 * 24 * 60 * 60,
});

router.post('/oauth/token', router.oauth.token());

router.post('/oauth/set_client', function (req, res, next) {
	OauthController.setClient(req.body)
		.then((client) => res.json(client))
		.catch((error) => {
			return next(error);
		});
});

module.exports = router;
