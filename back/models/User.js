const mongoose = require('mongoose'); // MongoDB : database manager

const uniqueValidator = require('mongoose-unique-validator'); // Mongoose: data validation

// Create a user schema
const userShema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}); 

// Add the unique validator to the user schema
userShema.plugin(uniqueValidator); 

module.exports = mongoose.model('User', userShema); // Export the user schema