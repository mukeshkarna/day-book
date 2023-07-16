/**
 * Can be used as
 * const varName = require('path/utils/flashMessages');
 *
 * varName.CREATED
 */

const CREATED = 'New record successfully created.';
const UPDATED = 'Record successfully updated.';
const DELETED = 'Record successfully deleted.';
const FAILED = 'Something went wrong. Please try again.';
const DATA_NOT_FOUND = 'Data not found';
const INVALID = 'Invalid ID';
const UNAUTHORIZED_USER = 'Unauthorized';

module.exports = {
	CREATED,
	UPDATED,
	DELETED,
	FAILED,
	DATA_NOT_FOUND,
	INVALID,
	UNAUTHORIZED_USER,
};
