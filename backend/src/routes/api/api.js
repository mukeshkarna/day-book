const express = require('express');
const router = express.Router();
const OauthController = require('../../controller/api/authController');

const OAuthServer = require('express-oauth-server');

router.oauth = new OAuthServer({
	model: OauthController,
	accessTokenLifetime: 1800, // 30 minutes
});

router.use('/auth', require('./auth'));

// router.use('/dashboard', router.oauth.authenticate(), require('./dashboard'));
router.use('/users', router.oauth.authenticate(), require('./user'));

// router.use('/forgetPassword', require('./forgetPassword'));

module.exports = router;
