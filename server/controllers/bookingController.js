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

module.exports = {
    createBooking,
};