// Internal Imports
const Bookings = require("../models/Bookings");
const Places = require("../models/Places");
const Notifications = require("../models/Notifications");
const { emitNotification } = require("../socket");
const { areDatesEqual } = require("../utilities/dateComparison");
const { TITLE_MESSAGES } = require("../utilities/constants");

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

module.exports = {
    checkBookingStatus,
    checkBookingVisit,
};
