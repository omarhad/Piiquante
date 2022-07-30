const express = require('express'); // Express : framework web
const router = express.Router(); // Create an instance of express

const userCtrl = require('../controllers/user'); // Import the user controller

router.post('/signup', userCtrl.signup); // Signup a new user
router.post('/login', userCtrl.login); // Login a user

module.exports = router; // Export the router