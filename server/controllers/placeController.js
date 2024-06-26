//Internal Imports
const Places = require("../models/Places");
const Actors = require("../models/Actors");
const Bookings = require("../models/Bookings");
const { getNearestUnavailableBlock } = require("../services/placeService");

// Get all the place
const getAllPlaces = async (req, res, next) => {
    try {
        let allPlaces = await Places.find({});
        if (allPlaces) {
            allPlaces = allPlaces.map((place) => ({
                ...place._doc,
                images: place.images.map(
                    (img) => `${process.env.APP_URL}/images/places/${img}`
                ),
            }));
            res.status(200).json({
                success: true,
                message: "All places are fetched successfully",
                places: allPlaces,
            });
        } else {
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
};

// Get place by ID
const getPlaceByID = async (req, res, next) => {
    try {
        const placeId = req.params.placeId;
        const place = await Places.findById(placeId);
        if (place) {
            res.status(200).json({
                success: true,
                message: "Place is fetched successfully",
                place: {
                    ...place._doc,
                    images: place.images.map(
                        (img) => `${process.env.APP_URL}/images/places/${img}`
                    ),
                },
            });
        } else {
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
};

//Get owner of the place
const getOwnerByID = async (req, res, next) => {
    try {
        const ownerId = req.params.ownerId;
        const owner = await Actors.findById(ownerId).select("-password");
        if (owner) {
            if (owner.isOwner) {
                res.status(200).json({
                    success: true,
                    message: "Owner is fetched successfully",
                    owner: {
                        ...owner._doc,
                        avatar: owner.avatar
                            ? `${process.env.APP_URL}/images/avatars/${owner.avatar}`
                            : null,
                    },
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "This user is not an owner",
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: "Owner not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Update isAvailable field of a place
const updatePlaceAvailability = async (req, res, next) => {
    try {
        const placeId = req.params.placeId;
        const isAvailable = req.body.isAvailable;
        const place = await Places.findById(placeId);
        const bookings = await Bookings.find({ placeId: placeId });

        if (place && req.user.userId.toString() === place.ownerId.toString()) {
            place.isAvailable = isAvailable;

            if (!isAvailable) {
                const isNotAvailableFrom = new Date(
                    req.body.isNotAvailableFrom
                );
                const isNotAvailableTo = new Date(req.body.isNotAvailableTo);
                const currentDate = new Date();

                if (isNotAvailableFrom && isNotAvailableTo) {
                    place.isNotAvailableFrom = isNotAvailableFrom;
                    place.isNotAvailableTo = isNotAvailableTo;

                    if (
                        currentDate >= isNotAvailableFrom &&
                        currentDate <= isNotAvailableTo
                    ) {
                        place.isAvailable = false;
                    } else {
                        place.isAvailable = true;
                    }
                } else {
                    res.status(400).json({
                        success: false,
                        message:
                            "Please provide isNotAvailableFrom and isNotAvailableTo fields",
                    });
                    return;
                }
            } else {
                place.isAvailable = isAvailable;
            }

            await place.save();
            if (!isAvailable) {
                await getNearestUnavailableBlock(bookings, place);
            }
            res.status(200).json({
                success: true,
                message: "Place availability updated successfully",
            });
        } else {
            if (!place) {
                res.status(404).json({
                    success: false,
                    message: "Place not found",
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized access",
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get places by owner ID
const getPlacesByOwnerID = async (req, res, next) => {
    try {
        const ownerId = req.params.ownerId;
        const places = await Places.find({ ownerId: ownerId });
        if (places) {
            res.status(200).json({
                success: true,
                message: "Places are fetched successfully",
                places: places,
            });
        } else {
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
};

// Add place
const addPlace = async (req, res, next) => {
    try {
        let images = null;
        if (req.files && req.files.length > 0) {
            images = req.files.map((file) => file.filename);
        } else {
            res.status(400).json({
                success: false,
                message: "Please upload at least one image",
            });
            return;
        }
        const newPlace = new Places({
            ...req.body,
            images: images,
            ownerId: req.user.userId,
        });
        const owner = await Actors.findById(req.user.userId);
        if (owner && !owner.isOwner) {
            owner.isOwner = true;
            await owner.save();
        }
        await newPlace.save();
        res.status(201).json({
            success: true,
            message: "Place added successfully",
            place: newPlace,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Search places
const searchPlaces = async (req, res, next) => {
    console.log(req.body);
    const {
        country,
        city,
        minPrice,
        maxPrice,
        minCapacity,
        minRating,
        amenities,
    } = req.body;
    let query = {
        ...(country && { country: { $regex: new RegExp(country, "i") } }),
        ...(city && { city: { $regex: new RegExp(city, "i") } }),
        ...(minPrice !== 0 && { price: { $gte: minPrice } }),
        ...(maxPrice !== 0 && { price: { $lte: maxPrice } }),
        ...(minCapacity !== 0 && { capacity: { $gte: minCapacity } }),
        ...(minRating !== 0 && { rating: { $gte: minRating } }),
        ...(amenities.length > 0 && { amenities: { $all: amenities } }),
    };

    try {
        let places = await Places.find(query);
        if (places && places.length > 0) {
            places = places.map((place) => ({
                ...place._doc,
                images: place.images.map(
                    (img) => `${process.env.APP_URL}/images/places/${img}`
                ),
            }));
            res.status(200).json({
                success: true,
                message: "PLaces are fetched successfully",
                places: places,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No place found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    getAllPlaces,
    getPlaceByID,
    getOwnerByID,
    updatePlaceAvailability,
    getPlacesByOwnerID,
    addPlace,
    searchPlaces,
};
