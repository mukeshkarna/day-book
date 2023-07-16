const meta = {
	copyright: '@daybook',
	email: 'info@daybook.com',
	api: {
		version: 1.0,
	},
};

module.exports = {
	respond: (res, data, status = 200, metaObject = {}) => {
		const statusCode = Number.isInteger(parseInt(status)) ? status : 500;
		return res.status(statusCode).json({
			meta: Object.assign(metaObject, meta),
			data: data,
		});
	},
};
