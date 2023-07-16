const config = require('../config/configure');
const { OAuthClient } = require('../models');

const clientData = {
	redirectUris: `${config.app_url}api/v1/auth/oauth/callback`,
	grants: ['password', 'refresh_token'],
};

async function seedOAuthClient() {
	try {
		const count = await OAuthClient.find({});
		if (count.length === 0) {
			const savedClient = await new OAuthClient(clientData).save();
			console.log(
				'Client ID and Client Secret Generated and Saved Successfully'
			);
		} else {
			console.log('Client ID and Client Secret Already Exists');
		}
	} catch (error) {
		console.log(error);
	}
}

seedOAuthClient();
