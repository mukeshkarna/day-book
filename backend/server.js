const express = require('express');
require('dotenv').config();
const loaders = require('./src/app');
const port = process.env.PORT || 5000;

let startServer = async () => {
	const app = express();
	await loaders.init(app);

	require('./src/config/db');

	//Set proper Headers on Backend
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		res.setHeader(
			'Access-Control-Allow-Headers',
			'Content-Type, Authorization'
		);
		next();
	});

	app.listen(port, (err) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log(`server running in port ${port}`);
	});
};
startServer();
