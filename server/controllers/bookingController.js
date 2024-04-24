// Internal imports
const Bookings = require("../models/Bookings");

//Create new booking
const createBooking = async (req, res, next) => {
    const { placeId, userId, checkIn, checkOut, guests } = req.body;
    try {
        const newBooking = new Bookings({
            placeId,
            userId,
            checkIn,
            checkOut,
            guests,
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