//Internal Imports
const Places = require("../models/Places");
const Actors = require("../models/Actors");
const dummyPlaces = require("../data/place_data");

// Push Dummy data if necessary
const pushDummyPlaces = async () => {
    try {
        const placesCount = await Places.countDocuments();
        if (placesCount === 0) {
            if (dummyPlaces && dummyPlaces.length > 0) {
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
                console.log("No dummy data found to push. Please add valid dummy!");
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
            if (
                currentDate >= isNotAvailableFrom &&
                currentDate <= isNotAvailableTo
            )
                place.isAvailable = false;
            await place.save();
        }
    } catch (error) {
        console.error("Error getting nearest unavailable block:", error);
    }
};

module.exports = {
    pushDummyPlaces,
    isAvailabilityStatusValid,
    getNearestUnavailableBlock,
};
