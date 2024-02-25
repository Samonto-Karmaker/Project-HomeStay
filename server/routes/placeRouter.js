//External imports
const express = require('express');

//Internal imports
const { getAllPlaces, getPlaceByID } = require('../controllers/placeController');

//Initializing Router
const router = express.Router();

//Get all places
router.get('/', getAllPlaces);

//Get a single place by ID
router.get('/:placeId', getPlaceByID);

module.exports = router;