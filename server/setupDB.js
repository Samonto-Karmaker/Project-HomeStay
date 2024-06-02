//External Imports
const mongoose = require("mongoose");

//Internal Imports
const {
    pushDummyPlaces,
    isAvailabilityStatusValid,
} = require("./services/placeService");
const {
    checkBookingStatus,
    checkBookingVisit,
} = require("./services/bookingService");

const setupDB = async () => {
    try {
        // Database Connection
        await mongoose.connect(process.env.MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully...");

        await Promise.all([
            pushDummyPlaces(),
            checkBookingStatus(),
            checkBookingVisit(),
            isAvailabilityStatusValid()
        ]);
    } catch (err) {
        console.log(`Error: ${err}`);
    }
};

module.exports = setupDB;
