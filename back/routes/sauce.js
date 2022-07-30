const express = require('express'); // Express : framework web
const router = express.Router(); // Create an instance of express

const auth = require('../middleware/auth'); // Import the auth middleware
const multer = require('../middleware/multer-config'); // Import the multer middleware

const sauceCtrl = require('../controllers/sauce'); // Import the sauce controller

router.get('/', auth, sauceCtrl.getAllSauces); // Get all sauces
router.post('/', auth, multer, sauceCtrl.createSauce); // Create a new sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); // Get one sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Modify one sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Delete one sauce
router.post('/:id/like', auth, sauceCtrl.rateSauce); // Like or dislike a sauce

module.exports = router; // Export the router

