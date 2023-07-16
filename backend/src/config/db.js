const mongoose = require('mongoose');
const config = require('./configure');

mongoose.connect(config.mongodb.url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('MongoDB database connection established successfully');
});
