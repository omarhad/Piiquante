const bcrypt = require('bcrypt'); // Bcrypt : gestionnaire de hashage
const User = require('../models/User'); // User : modèle de données
const jwt = require('jsonwebtoken'); // Json Web Token : token de sécurité
const CryptoJS = require('crypto-js'); // CryptoJS : gestionnaire de hashage

// Regex for the adress email
const emailRegex = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);


// POST : Create a new user
exports.signup = (req, res, next) => {
    if (!emailRegex(req.body.email)) {
        res.status(400).json({message: "Le format de l'email n'est pas valide."})
    } else {
        bcrypt.hash(req.body.password, 10) // Hash the password
        .then(hash => {
            // Create a new user
            const user = new User({
            email: req.body.email,
            password: hash
            }); 
            user.save() // Save the user in the database
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // Send a 201 response if the user is created
            .catch(error => res.status(400).json({ error })); // Send a 400 response if the user is not created
        })
        .catch(error => res.status(500).json({ error })); // Send a 500 response if the password is not hashed
    };
};

// GET : Get all users
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Find the user with the email
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // Send a 401 response if the user is not found
            }
            bcrypt.compare(req.body.password, user.password) // Compare the password with the hashed password
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' }); // Send a 401 response if the password is incorrect
                    }
                    res.status(200).json({
                        userId: user._id, 
                        token: jwt.sign(
                            { userId: user._id }, // Create a token with the userId
                            process.env.TOKEN_SECRET, // Set the secret
                            { expiresIn: '24h' } // Set the expiration date
                        )
                    }); // Send a 200 response if the password is correct
                })
                .catch(error => res.status(500).json({ error })); // Send a 500 response if the password is not hashed
        })
        .catch(error => res.status(500).json({ error })); // Send a 500 response if the user is not found
 };