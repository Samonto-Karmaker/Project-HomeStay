//Internal Imports
const Places = require("../models/Places");
const Actors = require("../models/Actors");
const Bookings = require("../models/Bookings");
const dummyPlaces = require("../data/place_data");

// Push Dummy data if necessary
const pushDummyPlaces = async () => {
    try {
        const placesCount = await Places.countDocuments();
        if (placesCount === 0) {
            await Places.insertMany(dummyPlaces);
            console.log("Dummy data pushed successfully!");
            for (let i = 0; i < dummyPlaces.length; i++) {
                const owner = await Actors.findById(dummyPlaces[i].ownerId);
                if (owner && !owner.isOwner) {
                    owner.isOwner = true;
                    await owner.save();
                }
            }
        } else {
            console.log("Places model is not empty. Skipping dummy data push.");
        }
    } catch (error) {
        console.error("Error pushing dummy data:", error);
    }
};

// Check if the available status of all places is valid
const isAvailabilityStatusValid = async () => {
    try {
        const places = await Places.find({});
        const currentDate = new Date();
        for (let i = 0; i < places.length; i++) {
            const place = places[i];
            if (place.isNotAvailableFrom && place.isNotAvailableTo) {
                if (
                    currentDate >= place.isNotAvailableFrom &&
                    currentDate <= place.isNotAvailableTo
                ) {
                    place.isAvailable = false;
                } else {
                    place.isAvailable = true;
                }
                await place.save();
            }
        }
        console.log("Availability status checked successfully!");
    } catch (error) {
        console.error("Error checking availability:", error);
    }
};

// Get the nearest unavailable time block
const getNearestUnavailableBlock = async (bookings, place) => {
    try {
        let { isNotAvailableFrom, isNotAvailableTo } = place;
        const currentDate = new Date().setHours(0, 0, 0, 0);
        let isBlockFound = false;

        if (isNotAvailableFrom && isNotAvailableTo) {
            if (isNotAvailableTo < currentDate) {
                isNotAvailableFrom = null;
                isNotAvailableTo = null;
                isBlockFound = true;
            }
        }

        const futureBookings = [...bookings]
            .filter((booking) => booking.checkOut > currentDate)
            .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

        let start = new Date(futureBookings[0].checkIn);
        let end = new Date(futureBookings[0].checkOut);
        for (let i = 1; i < futureBookings.length; i++) {
            const booking = futureBookings[i];
            if (new Date(booking.checkIn) - end / (1000 * 60 * 60 * 24) <= 1) {
                end = new Date(booking.checkOut);
            } else break;
        }

        if (isNotAvailableFrom && isNotAvailableTo) {
            if (isNotAvailableFrom > start) {
                isNotAvailableFrom = start;
                isBlockFound = true;
            }
            if (isNotAvailableTo < end) {
                isNotAvailableTo = end;
                isBlockFound = true;
            }
        } else {
            isNotAvailableFrom = start;
            isNotAvailableTo = end;
            isBlockFound = true;
        }

        if (isBlockFound) {
            place.isNotAvailableFrom = isNotAvailableFrom;
            place.isNotAvailableTo = isNotAvailableTo;
            if (currentDate >= isNotAvailableFrom && currentDate <= isNotAvailableTo) place.isAvailable = false;
            await place.save();
        }
    } catch (error) {
        console.error("Error getting nearest unavailable block:", error);
    }
};

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
    pushDummyPlaces,
    getAllPlaces,
    getPlaceByID,
    getOwnerByID,
    updatePlaceAvailability,
    getPlacesByOwnerID,
    isAvailabilityStatusValid,
    addPlace,
    searchPlaces,
    getNearestUnavailableBlock,
};
