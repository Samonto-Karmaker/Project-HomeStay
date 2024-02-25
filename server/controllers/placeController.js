//Internal Imports
const Places = require('../models/Places');
const dummyPlaces = require('../data/place_data');

// Push Dummy data if necessary
const pushDummyPlaces = async () => {
    try {
        const placesCount = await Places.countDocuments();
        if (placesCount === 0) {
            await Places.insertMany(dummyPlaces);
            console.log('Dummy data pushed successfully!');
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

module.exports = {
    pushDummyPlaces,
    getAllPlaces,
    getPlaceByID,
};
