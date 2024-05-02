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
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get bookings by user id
const getBookingsByUserId = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        let bookings = await Bookings.find({ userId: userId });
        if (bookings && bookings.length > 0) {
            // Promise.all() is used to wait for all the promises to resolve
            bookings = await Promise.all(
                bookings.map(async (booking) => {
                    const place = await Places.findById(booking.placeId);

                    // Convert booking document to JavaScript object
                    booking = booking.toObject();
                    booking.placeName = place.name;
                    booking.placeLocation = place.city + ", " + place.country;
                    booking.placePrice = place.price;
                    delete booking.userId;
                    return booking;
                })
            );
            res.status(200).json({
                success: true,
                message: "Bookings found",
                bookings: bookings,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No bookings found",
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

// Update rating
const updateRating = async (req, res, next) => {
    try {
        const bookingId = req.params.bookingId;
        const rating = req.body.rating;
        if (rating < 1 || rating > 5) {
            res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
            return;
        }

        const booking = await Bookings.findById(bookingId);
        if (booking) {
            if (booking.userId.toString() !== req.user.userId) {
                res.status(403).json({
                    success: false,
                    message: "You are not authorized to update this booking",
                });
                return;
            }
            if (booking.rating > 0) {
                res.status(400).json({
                    success: false,
                    message: "Rating already submitted",
                });
                return;
            }

            booking.rating = rating;
            await booking.save();

            const place = await Places.findById(booking.placeId);
            if (place) {
                const bookingCount = await Bookings.countDocuments({
                    placeId: place._id,
                });
                if (bookingCount === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No bookings found for this place",
                    });
                    return;
                }

                if (bookingCount === 1 && place.rating > 0) {
                    place.rating = (place.rating + rating) / 2;
                } else {
                    place.rating =
                        (place.rating * (bookingCount - 1) + rating) /
                        bookingCount;
                }
                await place.save();
            } else {
                res.status(404).json({
                    success: false,
                    message: "Place not found",
                });
            }
            res.status(200).json({
                success: true,
                message: "Booking rating updated",
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
    createBooking,
    getBookingsByUserId,
    updateRating,
};
