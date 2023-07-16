const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');

const bodyParser = require('body-parser');

var createError = require('http-errors');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');

const config = require('./config/configure');

const methodOverride = require('method-override');

let expressLoader = {};
const flash = require('connect-flash');
const session = require('express-session');

expressLoader.init = async (app) => {
	app.use(
		express.urlencoded({
			limit: '500mb',
			extended: true,
			parameterLimit: 50000,
		})
	);
	app.use(express.json({ limit: '500mb' }));
	app.use(flash());

	/**
	 * HTTP request handlers should not perform expensive operations such as accessing the file system,
	 * executing an operating system command or interacting with a database without limiting the rate at
	 * which requests are accepted. Otherwise, the application becomes vulnerable to denial-of-service attacks
	 * where an attacker can cause the application to crash or become unresponsive by issuing a large number of
	 * requests at the same time. For more information, visit: https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html
	 */
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	});

	// Apply the rate limiting middleware to all requests
	app.use(limiter);

	/**
	 * Enable CORS middleware. In production, modify as to allow only designated origins and methods.
	 * If you are using Azure App Service, we recommend removing the line below and configure CORS on the App Service itself.
	 */
	app.use(cors());

	app.use(
		session({
			secret: config.sessionSecret,
			resave: false,
			saveUninitialized: true,
			cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
		})
	);

	// File Upload setting
	app.use(fileUpload());

	app.use(methodOverride('_method'));
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.static('public'));

	app.use(morgan('dev'));

	//Routes
	require('./routes')(app);

	// Seeders
	require('./seeders/index');

	app.use((err, req, res, next) => {
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		res.status(err.status || 500).send(err);
	});

	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		next(createError(404));
	});

	return app;
};

module.exports = expressLoader;
