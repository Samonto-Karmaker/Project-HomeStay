//External imports
const express = require("express");

//Internal imports
const {
    getAllPlaces,
    getPlaceByID,
    getOwnerByID,
    updatePlaceAvailability,
    getPlacesByOwnerID,
    addPlace,
} = require("../controllers/placeController");
const { checkAuth } = require("../middlewares/common/protectPages");
const {
    addPlaceValidators,
    addPlaceValidationHandler,
} = require("../middlewares/place/add_place_validator");
const placeImgUploader = require("../middlewares/place/placeImgUploader");

//Initializing Router
const router = express.Router();

//Get all places
router.get("/", getAllPlaces);

//Get a single place by ID
router.get("/:placeId", getPlaceByID);

//Get the owner of a place
router.get("/owner-info/:ownerId", getOwnerByID);

//Update isAvailable field of a place
router.put("/update-availability/:placeId", checkAuth, updatePlaceAvailability);

//Get places by owner ID
router.get("/owner-places/:ownerId", getPlacesByOwnerID);

//Add a new place
router.post(
    "/add",
    checkAuth,
    addPlaceValidators,
    addPlaceValidationHandler,
    placeImgUploader,
    addPlace
);

module.exports = router;
