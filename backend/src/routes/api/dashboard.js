const express = require('express');
const router = express.Router();

const dashboardController = require('../../controller/api/dashboardController');

// Get List of Project list
router.get('/', dashboardController.index);

module.exports = router;
