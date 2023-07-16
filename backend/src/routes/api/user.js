const express = require('express');
const router = express.Router();

const userController = require('../../controller/api/userController');

// Get List of Users
router.get('/me', userController.currentUser);

module.exports = router;
