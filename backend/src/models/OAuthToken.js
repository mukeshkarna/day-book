var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const OAuthToken = new Schema({
	accessToken: {
		type: String,
		required: true,
		unique: true,
	},
	accessTokenExpiresAt: {
		type: Date,
		required: true,
	},
	refreshToken: {
		type: String,
		required: true,
		unique: true,
	},
	refreshTokenExpiresAt: {
		type: Date,
		required: true,
	},
	scope: {
		type: String,
	},
	client: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'OAuthClient',
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'OAuthUser',
	},
});

module.exports = mongoose.model('OAuthToken', OAuthToken);
