const dotenv = require('dotenv').config({ path: './env' });

let config = {};

/**
 * Application environment
 */
config.port = process.env.PORT || 5000;
config.app_env = process.env.NODE_ENV || 'development';
config.app_url = process.env.APP_URL || 'http://localhost:5000/';
config.react_app_url = process.env.FRONTEND_URL || 'http://localhost:3000/';

/**
 * Database Configuration
 */
config.mongodb = {};
config.mongodb.url =
	process.env.MONGO_URL || 'mongodb://localhost:27017/daybook';

config.sessionSecret = 'pasjofjoafb4qqowjf983479ajf283q9';

module.exports = config;
