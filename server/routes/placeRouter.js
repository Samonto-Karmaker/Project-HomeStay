//External imports
const express = require('express');

//Internal imports
const { getAllPlaces, getPlaceByID, getOwnerByID } = require('../controllers/placeController');

//Initializing Router
const router = express.Router();

//Get all places
router.get('/', getAllPlaces);

//Get a single place by ID
router.get('/:placeId', getPlaceByID);

//Get the owner of a place
router.get('/owner-info/:ownerId', getOwnerByID);

module.exports = router;