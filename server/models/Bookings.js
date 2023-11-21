//External imports
const mongoose = require('mongoose');

//Schema for Bookings
const bookingSchema = new mongoose.Schema(
    {
        placeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Places",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Actors",
            required: true,
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            required: true,
        },
        guests: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        isConfirmed: {
            type: Boolean,
            default: false,
        },
        isVisited: {
            type: Boolean,
            default: false
        }
    }
)

//Model for Bookings
const Bookings = mongoose.model('Bookings', bookingSchema);

module.exports = Bookings;