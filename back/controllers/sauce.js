const Sauce = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if (!sauce) {
            return res.status(404).json({message: 'Objet non trouvé !'});
        }
        fs.unlink(`images/${sauce.imageUrl.split('/images/')[1]}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
            .catch(error => { res.status(400).json( { error })})
        });
    })
    .catch(error => { res.status(400).json( { error })})
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id, _userId: req.auth.userId }, { ...sauceObject, _userId: req.auth.userId })
    .then(() => { res.status(200).json({message: 'Objet modifié !'})})
    .catch(error => { res.status(400).json( { error })})
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        res.status(200).json(sauce);
    }
    ).catch(error => {
        res.status(400).json({error});
    }
    );
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => { res.status(200).json(sauces)})
    .catch(error => { res.status(400).json( { error })})
};