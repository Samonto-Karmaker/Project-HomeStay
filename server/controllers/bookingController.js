// Internal imports
const Bookings = require("../models/Bookings");
const Places = require("../models/Places");

//Create new booking
const createBooking = async (req, res, next) => {
    try {
        const newBooking = new Bookings({
            ...req.body,
            userId: req.user.userId,
        });
        await newBooking.save();
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: newBooking,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Get bookings by user id
const getBookingsByUserId = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        let bookings = await Bookings.find({ userId: userId });
        if(bookings && bookings.length > 0) {

            // Promise.all() is used to wait for all the promises to resolve
            bookings = await Promise.all(bookings.map(async (booking) => {
                const place = await Places.findById(booking.placeId);

                // Convert booking document to JavaScript object
                booking = booking.toObject();
                booking.placeName = place.name;
                booking.placeLocation = place.city + ", " + place.country;
                booking.placePrice = place.price;
                delete booking.placeId;
                delete booking.userId;
                return booking;
            }))
            res.status(200).json({
                success: true,
                message: "Bookings found",
                bookings: bookings,
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "No bookings found",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = {
    createBooking,
    getBookingsByUserId,
};