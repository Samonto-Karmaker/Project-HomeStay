//Internal Imports
const Places = require('../models/Places');
const Actors = require('../models/Actors');
const dummyPlaces = require('../data/place_data');

// Push Dummy data if necessary
const pushDummyPlaces = async () => {
    try {
        const placesCount = await Places.countDocuments();
        if (placesCount === 0) {
            await Places.insertMany(dummyPlaces);
            console.log('Dummy data pushed successfully!');
            for(let i=0; i<dummyPlaces.length; i++) {
                const owner = await Actors.findById(dummyPlaces[i].ownerId);
                if(owner && !owner.isOwner) {
                    owner.isOwner = true;
                    await owner.save();
                }
            }
        } else {
            console.log('Places model is not empty. Skipping dummy data push.');
        }
    } catch (error) {
        console.error('Error pushing dummy data:', error);
    }
};

// Get all the place
const getAllPlaces = async (req, res, next) => {
    try {
        let allPlaces = await Places.find({});
        if(allPlaces) {
            allPlaces = allPlaces.map(place => ({
                ...place._doc,
                images: place.images.map(img => `${process.env.APP_URL}/images/places/${img}`)
            }))
            res.status(200).json({
                success: true,
                message: "All places are fetched successfully",
                places: allPlaces,
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "No places found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// Get place by ID
const getPlaceByID = async (req, res, next) => {
    try {
        const placeId = req.params.placeId;
        const place = await Places.findById(placeId);
        if(place) {
            res.status(200).json({
                success: true,
                message: "Place is fetched successfully",
                place: {
                    ...place._doc,
                    images: place.images.map(img => `${process.env.APP_URL}/images/places/${img}`)
                }
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "Place not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//Get owner of the place
const getOwnerByID = async (req, res, next) => {
    try{
        const ownerId = req.params.ownerId;
        const owner = await Actors.findById(ownerId);
        if(owner) {
            if(owner.isOwner) {
                res.status(200).json({
                    success: true,
                    message: "Owner is fetched successfully",
                    owner: owner,
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "This user is not an owner",
                });
            }
        }
        else {
            res.status(404).json({
                success: false,
                message: "Owner not found",
            });
        }
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// Update isAvailable field of a place
const updatePlaceAvailability = async (req, res, next) => {
    try {
        const placeId = req.params.placeId;
        const isAvailable = req.body.isAvailable;
        const place = await Places.findById(placeId);

        if(place && req.user._id.toString() === place.ownerId.toString()){
            place.isAvailable = isAvailable;

            if(!isAvailable) {
                const isNotAvailableFrom = req.body.isNotAvailableFrom;
                const isNotAvailableTo = req.body.isNotAvailableTo;

                if(isNotAvailableFrom && isNotAvailableTo) {
                    place.isNotAvailableFrom = isNotAvailableFrom;
                    place.isNotAvailableTo = isNotAvailableTo;
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: "Please provide isNotAvailableFrom and isNotAvailableTo fields",
                    });
                    return;
                }
            }

            await place.save();
            res.status(200).json({
                success: true,
                message: "Place availability updated successfully",
            });
        }
        else {
            if(!place) {
                res.status(404).json({
                    success: false,
                    message: "Place not found",
                });
            }
            else {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized access",
                });
            }
        }
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = {
    pushDummyPlaces,
    getAllPlaces,
    getPlaceByID,
    getOwnerByID,
    updatePlaceAvailability,
};
