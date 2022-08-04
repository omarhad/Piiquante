const jwt = require('jsonwebtoken'); // Json Web Token : token de sécurité
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // Get the token from the header
       const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); // Decode the token
       const userId = decodedToken.userId; // Get the user id from the decoded token
       if (req.body.userId && req.body.userId !== userId) { // Check if the user id in the body is the same as the user id in the token
           throw 'User id does not match token user id';
       } else {
            req.auth = {
                userId: userId
            }; // Add the user id to the request object
            next(); // Call the next middleware
        }
   } catch(error) {
       res.status(401).json({ error }); // If the token is not valid, send a 401 response
   }
};