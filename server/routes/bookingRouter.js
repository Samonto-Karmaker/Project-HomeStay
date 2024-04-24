// External imports
const express = require("express");

// Internal imports
const { checkAuth } = require("../middlewares/common/protectPages");
const { createBooking } = require("../controllers/bookingController");
const {
    createBookingValidators,
    createBookingValidationResultHandler,
} = require("../middlewares/bookings/create_booking_validator");

// Initialize router
const router = express.Router();

router.post(
    "/",
    checkAuth,
    createBookingValidators,
    createBookingValidationResultHandler,
    createBooking
);

exports.default = router;
