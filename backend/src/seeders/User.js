const { OAuthUser } = require('../models');

let defaultUser = {
	password: '1234Admin@',
	email: 'mukesh@admin.com',
	firstName: 'Admin',
	lastName: 'User',
};

async function seedOAuthUser() {
	try {
		const user = await OAuthUser.find({ email: defaultUser.email });
		if (user.length == 0) {
			const newUser = await new OAuthUser(defaultUser).save();
			if (newUser) {
				console.log('User Created Successfully');
			} else {
				console.log('User Creation Failed');
			}
		} else {
			console.log('User Already Exists');
		}
	} catch (error) {
		console.log(error);
	}
}

seedOAuthUser();
