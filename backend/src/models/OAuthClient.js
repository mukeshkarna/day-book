var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const OAuthClient = new Schema({
	clientId: { type: String, unique: true },
	clientSecret: { type: String },
	redirectUris: { type: [String], required: true },
	grants: { type: [String], required: true },
});

//Overriding default data format
OAuthClient.methods.toJSON = function () {
	var client = this;
	var clientObject = client.toObject();
	return _.pick(clientObject, [, 'clientId', 'clientSecret']);
};

OAuthClient.pre('save', function (next) {
	var client = this;
	var id = new ObjectID().toHexString();
	client.clientId = id;
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(id, salt, (err, hash) => {
			client.clientSecret = hash;
			next();
		});
	});
	// next();
});

module.exports = mongoose.model('OAuthClient', OAuthClient);
