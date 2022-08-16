const Sauce = require('../models/sauces'); // Import the sauce model
const fs = require('fs'); // File System : file manager

// POST : Create a new sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // Convert the JSON string to an object
  delete sauceObject._id; // Delete the _id property
  // Create a new sauce
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save() // Save the new sauce in the database
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})}) // Send a response with a status code 201 (Created)
  .catch(error => { res.status(400).json( { error })}) // Send a response with a status code 400 (Bad Request)
};

// POST : Like or Dislike a sauce
exports.rateSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // Find the sauce
    .then(sauce => {
        const like = req.body.like; // Get the like value
        const user = req.body.userId; // Get the user id
        // If the user like the sauce
        if (like === 1) {
            if (!sauce.usersLiked.includes(user)) {
                sauce.likes++; // Increment the likes
                sauce.usersLiked.push(user); // Add the user id to the list of users who liked the sauce
            }
        }
        // If the user dislike the sauce
        if (like === -1) {
            if (!sauce.usersDisliked.includes(user)) {
                sauce.dislikes++; // Increment the dislikes
                sauce.usersDisliked.push(user); // Add the user id to the list of users who disliked the sauce
            }
        }
        // If the user withdraws the evaluation
        if (like === 0) {
            // If he removes a like
            if (sauce.usersLiked.includes(user)) {
                sauce.likes--; // Decrement the likes
                const index = sauce.usersLiked.indexOf(user); // Get the index of the user id in the list of users who liked the sauce
                sauce.usersLiked.splice(index, 1); // Remove the user id from the list of users who liked the sauce
            }
            // If he removes a dislike
            if (sauce.usersDisliked.includes(user)) {
                sauce.dislikes--; // Decrement the dislikes
                const index = sauce.usersDisliked.indexOf(user); // Get the index of the user id in the list of users who disliked the sauce
                sauce.usersDisliked.splice(index, 1); // Remove the user id from the list of users who disliked the sauce
            }
        }
        // Save the changes in the database
        Sauce.updateOne(
            {_id: req.params.id}, // Find the sauce
            {
            likes: sauce.likes,
            dislikes: sauce.dislikes,
            usersLiked: sauce.usersLiked,
            usersDisliked: sauce.usersDisliked,
            _id: req.params.id
            } // Update the sauce
        )
        .then(()=> res.status(200).json({message: "L'évaluation de la sauce a bien été mise à jour !"})) // Send a response with a status code 200 (OK)
        .catch(error => res.status(400).json({error})); // Send a response with a status code 400 (Bad Request)
    })
    .catch(error => res.status(404).json({error})); // Send a response with a status code 404 (Not Found)
};

// DELETE : Delete a sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // Find the sauce
    .then(sauce => {
        if (!sauce) {
            return res.status(404).json({message: 'Objet non trouvé !'}); // Send a response with a status code 404 (Not Found)
        }
        fs.unlink(`images/${sauce.imageUrl.split('/images/')[1]}`, () => {
            Sauce.deleteOne({_id: req.params.id}) // Delete the sauce
            .then(() => { res.status(200).json({message: 'Objet supprimé !'})}) // Send a response with a status code 200 (OK)
            .catch(error => { res.status(400).json( { error })}) // Send a response with a status code 400 (Bad Request)
        });
    })
    .catch(error => { res.status(400).json( { error })}) // Send a response with a status code 400 (Bad Request)
};

// PUT : Update a sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? { // If a file is uploaded
        ...JSON.parse(req.body.sauce), // Convert the JSON string to an object
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Update the imageUrl property
    } : { ...req.body }; // If no file is uploaded, convert the JSON string to an object
    Sauce.updateOne({ _id: req.params.id, _userId: req.auth.userId }, { ...sauceObject, _userId: req.auth.userId }) // Update the sauce
    .then(() => { res.status(200).json({message: 'Objet modifié !'})}) // Send a response with a status code 200 (OK)
    .catch(error => { res.status(400).json( { error })}) // Send a response with a status code 400 (Bad Request)
};

// GET : Get one sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // Find the sauce
    .then(sauce => {
        res.status(200).json(sauce); // Send a response with a status code 200 (OK)
    }
    ).catch(error => {
        res.status(400).json({error}); // Send a response with a status code 400 (Bad Request)
    }
    );
};

// GET : Get all sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find() // Find all sauces
    .then(sauces => { res.status(200).json(sauces)}) // Send a response with a status code 200 (OK)
    .catch(error => { res.status(400).json( { error })}) // Send a response with a status code 400 (Bad Request)
};