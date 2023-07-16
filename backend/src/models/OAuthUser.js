var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const OAuthUser = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	firstName: { type: String },
	lastName: { type: String },
	otp: {
		type: String,
	},
	otpCreateTime: {
		type: Date,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
	},
	deletedAt: {
		type: Date,
	},
	token: {
		type: String,
	},
	tokenCreateTime: {
		type: Date,
	},
});

/**
 * Hash the password and sms token for security.
 */
OAuthUser.pre('save', function (next) {
	var user = this;
	if (!user.isModified('password')) return next();
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(user.password, salt, (err, hash) => {
			user.password = hash;
			next();
		});
	});
});

/**
 * Check the user's password
 */
OAuthUser.methods.verifyPassword = function (password, cb) {
	bcrypt.compare(password, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('OAuthUser', OAuthUser);
