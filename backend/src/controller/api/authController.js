const { isEmpty } = require('lodash');
const passport = require('passport');

const bcrypt = require('bcryptjs');
const OAuthToken = require('../../models/OAuthToken');
const { OAuthClient, OAuthUser } = require('../../models');

const ApiService = require('../../services/api.service');

let apiAuthController = {
	/**
	 * Invoked to retrieve an existing access token previously saved through Model#saveToken().
	 *
	 * @param {String} accessToken The access token to retrieve.
	 */
	getAccessToken: function (bearerToken) {
		return OAuthToken.findOne({
			accessToken: bearerToken,
		})
			.populate('client')
			.populate('user')
			.lean()
			.then((token) => {
				if (!token) {
					return false;
				}
				return {
					accessToken: token.accessToken,
					accessTokenExpiresAt: token.accessTokenExpiresAt,
					client: token.client,
					user: token.user,
					scope: token.scope,
				};
			})
			.catch((error) => console.error(error));
	},

	/**
	 * Invoked to retrieve a client using a client id or a client
	 * id/client secret combination, depending on the grant type.
	 *
	 * @param {*} clientId      The client id of the client to retrieve.
	 * @param {*} clientSecret  The client secret of the client to retrieve. Can be null.
	 */
	getClient: function (clientId, clientSecret) {
		return OAuthClient.findOne({
			clientId: clientId,
			clientSecret: clientSecret,
		})
			.then((client) => {
				if (!client) {
					return false;
				}
				return {
					id: client._id,
					redirectUris: client.redirectUris,
					grants: client.grants,
				};
			})
			.catch((error) => console.error(error));
	},

	/**
	 * Invoked to retrieve an existing refresh token previously saved through Model#saveToken().
	 *
	 * @param {String} refreshToken The access token to retrieve.
	 * @returns {Object} An Object representing the refresh token and associated data.
	 */
	getRefreshToken: function (refreshToken) {
		return OAuthToken.findOne({
			refreshToken: refreshToken,
		})
			.populate('client')
			.populate('user')
			.lean()
			.then((token) => {
				if (!token) {
					return false;
				}
				return {
					refreshToken: token.refreshToken,
					refreshTokenExpiresAt: token.refreshTokenExpiresAt,
					client: token.client,
					user: token.user,
					scope: token.scope,
				};
			})
			.catch((error) => console.error(error));
	},

	/**
	 * Invoked to retrieve a user using a username/password combination.
	 *
	 * @param {*} username
	 * @param {*} password
	 *
	 * @returns An Object representing the user, or a falsy value if no such user could
	 *          be found. The user object is completely transparent to oauth2-server and is
	 *          simply used as input to other model functions.
	 */
	getUser: function (email, password) {
		return OAuthUser.findOne({ email: email, deletedAt: null }).then((user) => {
			const isMatch = user
				? bcrypt.compareSync(password, user.password)
				: false;

			if (isMatch) {
				return user;
			} else {
				console.error('Password not match');
			}
		});
	},

	/**
	 * Invoked to retrieve a user using an access token.
	 * Method to get the user based on the access token
	 *
	 * @param {String} accessToken
	 * @returns {Object}
	 */
	getUserFromToken: async (authHeader) => {
		try {
			if (!authHeader) {
				// No Authorization header provided
				return { error: 'No Authorization header provided' };
			}
			const parts = authHeader.split(' ');
			if (parts.length !== 2 || parts[0] !== 'Bearer') {
				// Invalid Authorization header format
				return { error: 'Invalid Authorization header format' };
			}
			const accessToken = parts[1];
			// Implement logic to retrieve the user based on the access token
			// Retrieve the user data from the session and return it
			return OAuthToken.findOne({
				accessToken: accessToken,
			})
				.populate('user')
				.lean()
				.then((token) => {
					if (!token) {
						return false;
					}
					return token.user;
				})
				.catch((error) => console.error(error));
		} catch (error) {
			return error;
		}
	},

	/**
	 * Invoked to save an access token and optionally a refresh token,
	 * depending on the grant type.
	 *
	 * @param {Object} token The token(s) to be saved.
	 * @param {String} token.accessToken The access token to be saved.
	 * @param {Date} token.accessTokenExpiresAt The expiry time of the access token.
	 * @param {String} token.refreshToken The refresh token to be saved.
	 * @param {Date} token.refreshTokenExpiresAt The expiry time of the refresh token.
	 * @param {String} token.scope The authorized scope of the token(s).
	 *
	 * @param {Object} client The client associated with the token(s).
	 * @param {Object} user The user associated with the token(s).
	 */
	saveToken: async (token, client, user) => {
		const oauthToken = new OAuthToken({
			accessToken: token.accessToken,
			accessTokenExpiresAt: token.accessTokenExpiresAt,
			client: client.id,
			refreshToken: token.refreshToken,
			refreshTokenExpiresAt: token.refreshTokenExpiresAt,
			user: user._id,
		});

		try {
			await oauthToken.save();

			const data = oauthToken.toObject();
			data.client = client.id;
			data.user = user._id;

			return data;
		} catch (error) {
			console.error(error);
		}
	},

	/**
	 * Invoked to revoke a refresh token.
	 *
	 * @param {Object} token The token to be revoked.
	 * @param {String} token.refreshToken The refresh token.
	 * @param {Date}   token.refreshTokenExpiresAt The expiry time of the refresh token.
	 * @param {String} token.scope The authorized scope of the refresh token.
	 * @param {Object} token.client The client associated with the refresh token.
	 * @param {String} token.client.id A unique string identifying the client.
	 * @param {Object} token.user The user associated with the refresh token.
	 * @returns {Boolean} Return true if the revocation was successful or false if the refresh token could not be found.
	 */
	revokeToken: async (token) => {
		try {
			const refreshToken = await OAuthToken.findOne({
				refreshToken: token.refreshToken,
			});
			if (!refreshToken) {
				return false;
			}
			await refreshToken.delete();
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	},

	setClient: function (client) {
		return new OAuthClient({
			clientId: client.clientId,
			clientSecret: client.clientSecret,
			redirectUris: client.redirectUris,
			grants: client.grants,
		})
			.save()
			.then((client) => {
				client = client && typeof client == 'object' ? client.toJSON() : client;
				const data = new Object();
				for (const prop in client) data[prop] = client[prop];
				data.client = data.clientId;
				data.grants = data.grants;

				return data;
			})
			.catch((error) => console.error(error));
	},

	setUser: function (user) {
		const newUser = new OAuthUser({
			email: user.email,
			password: user.password,
			firstName: user.firstName,
			lastName: user.lastName,
		});

		return newUser
			.save()
			.then((userResult) => {
				const data = userResult.toObject();
				data.name = data.firstName + ' ' + data.lastName;

				return data;
			})
			.catch((error) => console.error(error));
	},
};
module.exports = apiAuthController;
