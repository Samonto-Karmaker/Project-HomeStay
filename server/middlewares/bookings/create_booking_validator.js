// External Imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

//Internal Imports
const Places = require("../../models/Places");

const createBookingValidators = [
    check("placeId")
        .isMongoId()
        .withMessage("PlaceIdError: Place ID is not valid")
        .custom(async (placeId) => {
            try {
                const place = await Places.findById(placeId);
                if (!place) {
                    throw createError("PlaceIdError: Place not found");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("checkIn")
        .isDate()
        .withMessage("CheckInError: Check in date is not valid")
        .custom((checkIn) => {
            if (checkIn < new Date()) {
                throw createError(
                    "CheckInError: Check in date must be greater than current date"
                );
            }
            return true;
        }),
    check("checkOut")
        .isDate()
        .withMessage("CheckOutError: Check out date is not valid")
        .custom((checkOut, { req }) => {
            if (checkOut <= req.body.checkIn) {
                throw createError(
                    "CheckOutError: Check out date must be greater than check in date"
                );
            }
            return true;
        }),
    check("guests")
        .isInt({ min: 1 })
        .withMessage("GuestsError: Guests must be a positive integer"),
];

const createBookingValidationResultHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) next();
    else {
        console.log(mappedErrors);
        res.status(400).json({
            errors: mappedErrors,
        });
    }
};

module.exports = {
    createBookingValidators,
    createBookingValidationResultHandler
}
