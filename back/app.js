const express = require('express'); // Express : framework web
const dotenv = require("dotenv"); // Dotenv : gestionnaire de variables d'environnement
const mongoose = require('mongoose'); // MongoDB : gestionnaire de base de données
const helmet = require("helmet"); // Helmet : protection des headers HTTP
const rateLimit = require('express-rate-limit'); // Express rate limit : limite de requêtes

const path = require('path'); // Path : gestionnaire de chemins

const app = express(); // Create an instance of express
const userRoutes = require('./routes/user'); // Import the user routes
const sauceRoutes = require('./routes/sauce'); // Import the sauce routes

dotenv.config(); // Load the .env file

// Connect to MongoDB
mongoose.connect(`${process.env.MONGODB_SRV}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')); 

// Parse JSON bodies
app.use(express.json()); 

// Use helmet to secure Express headers
app.use(helmet());

// Use rate limit to limit the number of requests from the same IP
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
// Apply to all requests
app.use(limiter);

// Allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/api/sauces', sauceRoutes); // Use the sauce routes
app.use('/api/auth', userRoutes); // Use the user routes
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve the images folder

module.exports = app; // Export the app