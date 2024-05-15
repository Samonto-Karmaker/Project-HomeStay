// Internal imports
const Bookings = require("../models/Bookings");
const Places = require("../models/Places");
const Actors = require("../models/Actors");
const Notifications = require("../models/Notifications");
const { emitNotification } = require("../socket");
const { areDatesEqual } = require("../utilities/dateComparison");

// Constants
const STATUS_MESSAGES = {
    isConfirmed: "Your booking has been confirmed",
    isPaid: "Your payment has been received",
    isVisited: "Your visit has been recorded",
};

const TITLE_MESSAGES = {
    reminder: "Booking reminder",
    cancellation: "Booking cancellation",
    approval: "Booking approval",
    request: "Booking request",
};

// Check if all the bookings are confirmed in due time
const checkBookingStatus = async () => {
    try {
        console.log("Checking booking status...");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookings = await Bookings.find({
            checkIn: { $lte: today },
            isConfirmed: false,
        });
        if (bookings && bookings.length > 0) {
            for (const booking of bookings) {
                try {
                    const place = await Places.findById(booking.placeId).select(
                        "ownerId name"
                    );
                    if (place) {
                        if (areDatesEqual(booking.checkIn, today)) {
                            const notification = new Notifications({
                                title: TITLE_MESSAGES.reminder,
                                message: `Please confirm the booking for ${place.name} by today to avoid cancellation`,
                                userId: place.ownerId,
                            });
                            await notification.save();
                            emitNotification(place.ownerId, notification);
                        } else {
                            const notificationToBooker = new Notifications({
                                title: TITLE_MESSAGES.cancellation,
                                message: `Your booking for ${place.name} has been cancelled due to non-confirmation`,
                                userId: booking.userId,
                            });
                            const notificationToOwner = new Notifications({
                                title: TITLE_MESSAGES.cancellation,
                                message: `Booking for ${place.name} has been cancelled due to non-confirmation`,
                                userId: place.ownerId,
                            });

                            await Promise.all([
                                notificationToBooker.save(),
                                notificationToOwner.save(),
                            ]);

                            emitNotification(
                                booking.userId,
                                notificationToBooker
                            );
                            emitNotification(
                                place.ownerId,
                                notificationToOwner
                            );

                            console.log(
                                `Booking ${booking._id} cancelled due to non-confirmation`
                            );
                            await Bookings.findByIdAndDelete(booking._id);
                        }
                    }
                } catch (error) {
                    console.error(`Error processing ${booking._id}: ${error}`);
                }
            }
        }
        console.log("Booking status checked");
    } catch (error) {
        console.error(`Error in checkBookingStatus: ${error}`);
    }
};

// Check if all the bookings are visited in due time
/*
    p  v  cancel
    0  0  1 // Cancel booking
    0  1  0 // Notify owner on checkout date but don't cancel
    1  0  0 // Notify booker on checkout but don't cancel
    1  1  0 // Perfect

    that means the condition is:
    checkOut <= today && isConfirmed && (!isVisited || !isPaid)
*/
const checkBookingVisit = async () => {
    try {
        console.log("Checking booking visit...");
        const today = new Date();
        const bookings = await Bookings.find({
            checkOut: { $lte: today },
            isConfirmed: true,
            $or: [{ isVisited: false }, { isPaid: false }],
        });
        if (bookings && bookings.length > 0) {
            for (const booking of bookings) {
                try {
                    const place = await Places.findById(booking.placeId).select(
                        "ownerId name"
                    );
                    if (place) {
                        if (!booking.isVisited && !booking.isPaid) {
                            if (areDatesEqual(booking.checkOut, today)) {
                                const notificationToBooker = new Notifications({
                                    title: TITLE_MESSAGES.reminder,
                                    message: `Please checkout from ${place.name} today`,
                                    userId: booking.userId,
                                });
                                const notificationToOwner = new Notifications({
                                    title: TITLE_MESSAGES.reminder,
                                    message: `Please check if ${booking.userId} has checked out from ${place.name} today`,
                                    userId: place.ownerId,
                                });
                                await Promise.all([
                                    notificationToBooker.save(),
                                    notificationToOwner.save(),
                                ]);
                                emitNotification(
                                    booking.userId,
                                    notificationToBooker
                                );
                                emitNotification(
                                    place.ownerId,
                                    notificationToOwner
                                );
                            } else {
                                const notificationToBooker = new Notifications({
                                    title: TITLE_MESSAGES.cancellation,
                                    message: `Your booking for ${place.name} has been cancelled due to non-visitation`,
                                    userId: booking.userId,
                                });
                                const notificationToOwner = new Notifications({
                                    title: TITLE_MESSAGES.cancellation,
                                    message: `Booking for ${place.name} has been cancelled due to non-visitation`,
                                    userId: place.ownerId,
                                });

                                await Promise.all([
                                    notificationToBooker.save(),
                                    notificationToOwner.save(),
                                ]);

                                emitNotification(
                                    booking.userId,
                                    notificationToBooker
                                );
                                emitNotification(
                                    place.ownerId,
                                    notificationToOwner
                                );

                                console.log(
                                    `Booking ${booking._id} cancelled due to non-confirmation`
                                );
                                await Bookings.findByIdAndDelete(booking._id);
                            }
                        } else if (!booking.isVisited && booking.isPaid) {
                            if (areDatesEqual(booking.checkOut, today)) {
                                const notificationToBooker = new Notifications({
                                    title: TITLE_MESSAGES.reminder,
                                    message: `Your Payment for ${place.name} has been received already. 
                                        Please visit the place by today or talk to the owner for any changes and refund`,
                                    userId: booking.userId,
                                });
                                await notificationToBooker.save();
                                emitNotification(
                                    booking.userId,
                                    notificationToBooker
                                );
                            }
                        } else if (booking.isVisited && !booking.isPaid) {
                            if (areDatesEqual(booking.checkOut, today)) {
                                const notificationToOwner = new Notifications({
                                    title: TITLE_MESSAGES.reminder,
                                    message: `Your guest has visited ${place.name}. 
                                        Please check if the payment has been received`,
                                    userId: place.ownerId,
                                });
                                await notificationToOwner.save();
                                emitNotification(
                                    place.ownerId,
                                    notificationToOwner
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error processing ${booking._id}: ${error}`);
                }
            }
        }
        console.log("Booking visit checked");
    } catch (error) {
        console.error(`Error in checkBookingVisit: ${error}`);
    }
};

//Create new booking
const createBooking = async (req, res, next) => {
    try {
        const newBooking = new Bookings({
            ...req.body,
            userId: req.user.userId,
        });
        await newBooking.save();

        const place = await Places.findById(req.body.placeId).select(
            "name ownerId"
        );

        const notification = new Notifications({
            title: TITLE_MESSAGES.request + ": " + place.name,
            message: `${req.user.name} has requested to book your place: ${place.name}`,
            userId: place.ownerId,
        });
        await notification.save();
        emitNotification(place.ownerId, notification);

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
                success: true,
                message: "No bookings found",
                bookings: [],
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
        const rating = Number(req.body.rating);
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
            if (!booking.isVisited) {
                res.status(400).json({
                    success: false,
                    message: "Booking not visited yet",
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

// Get Bookings by place id
const getBookingsByPlaceId = async (req, res, next) => {
    try {
        const placeId = req.params.placeId;
        const userId = req.user.userId;
        const isOwner = req.user.isOwner;
        const place = await Places.findById(placeId);

        if (!place) {
            res.status(404).json({
                success: false,
                message: "Place not found",
            });
            return;
        }
        if (isOwner && place.ownerId.toString() !== userId) {
            res.status(403).json({
                success: false,
                message:
                    "You are not authorized to get bookings for this place",
            });
            return;
        }

        let bookings = await Bookings.find({ placeId: placeId })
            .sort({ createAt: -1 })
            .select("-rating");
        if (bookings && bookings.length > 0) {
            bookings = await Promise.all(
                bookings.map(async (booking) => {
                    const user = await Actors.findById(booking.userId);
                    booking = booking.toObject();
                    booking.guestName = user.name;
                    booking.guestEmail = user.email;
                    booking.price = place.price;
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
                success: true,
                message: "No bookings found for this place",
                bookings: [],
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

// Approve booking status and send notification to guest
const approveBooking = async (req, res, next) => {
    try {
        if (!req.user.isOwner) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to approve booking",
            });
            return;
        }

        const bookingId = req.params.bookingId;
        const status = req.body.status;
        const message = STATUS_MESSAGES[status];
        if (!message) {
            res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        const booking = await Bookings.findById(bookingId);
        if (!booking) {
            res.status(404).json({
                success: false,
                message: "Booking not found",
            });
            return;
        }
        if (booking[status]) {
            res.status(400).json({
                success: false,
                message: "Booking is already confirmed",
            });
            return;
        }
        if (status !== "isConfirmed" && !booking.isConfirmed) {
            res.status(400).json({
                success: false,
                message: "Booking is not confirmed",
            });
            return;
        }
        if (status === "isVisited" && booking.checkIn > new Date().setHours(0, 0, 0, 0)) {
            res.status(400).json({
                success: false,
                message: "Booking check-in date is in the future",
            });
            return;
        }

        booking[status] = true;
        await booking.save();

        const placeName = await Places.findById(booking.placeId).select("name");

        const notification = new Notifications({
            title: TITLE_MESSAGES.approval + ": " + placeName.name,
            message: message,
            userId: booking.userId,
        });
        await notification.save();

        emitNotification(booking.userId, notification);

        res.status(200).json({
            success: true,
            message: "Booking status updated",
        });
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
    getBookingsByPlaceId,
    approveBooking,
    checkBookingStatus,
    checkBookingVisit,
};
