// Internal imports
const Bookings = require("../models/Bookings");

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
        const bookings = await Bookings.find({ userId: userId });
        if(bookings && bookings.length > 0) {
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