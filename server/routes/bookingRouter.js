// External imports
const express = require("express");

// Internal imports
const { checkAuth } = require("../middlewares/common/protectPages");
const {
    createBooking,
    getBookingsByUserId,
    updateRating,
    getBookingsByPlaceId,
    approveBooking,
    cancelBooking,
} = require("../controllers/bookingController");
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
router.get("/", checkAuth, getBookingsByUserId);
router.put("/:bookingId/rating", checkAuth, updateRating);
router.get("/:placeId", checkAuth, getBookingsByPlaceId);
router.put("/:bookingId/approve", checkAuth, approveBooking);
router.delete("/:bookingId", checkAuth, cancelBooking);

module.exports = router;
