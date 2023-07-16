const api = require('./api/api');

module.exports = (app) => {
	/**
	 * Routes for API
	 */
	app.use('/api/v1', api);

	/**
	 * Routes for handling errors
	 */
	// 403 error
	app.get('/403', function (req, res) {
		return res.status('403').json({ message: 'Unauthorized' });
	});

	// 500 error
	app.get('/500', function (req, res) {
		return res.status('500').json({ message: 'Server Error' });
	});

	// 404 error
	app.get('*', function (req, res) {
		return res.status('404').json({ message: 'Not Found' });
	});
};
