//External imports
const express = require('express');

//Internal imports
const { getAllPlaces } = require('../controllers/placeController');

//Initializing Router
const router = express.Router();

//Get all places
router.get('/', getAllPlaces);

module.exports = router;