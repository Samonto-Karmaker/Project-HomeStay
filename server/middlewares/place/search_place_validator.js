const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const searchPlaceValidator = [
    check("city")
        .optional()
        .isString()
        .withMessage("City must be a string")
        .isAlpha()
        .withMessage("City must contain only alphabetic characters"),
    check("country")
        .optional()
        .isString()
        .withMessage("Country must be a string")
        .isAlpha()
        .withMessage("Country must contain only alphabetic characters"),
    check("minPrice")
        .optional()
        .isNumeric({min: 0})
        .withMessage("Min price must be a number"),
    check("maxPrice")
        .optional()
        .isNumeric({min: 0})
        .withMessage("Max price must be a number")
        .custom((maxPrice, { req }) => {
            if (Number(maxPrice) < Number(req.query.minPrice)) {
                throw createError("Max price must be greater than or equal to min price");
            }
            return true;
        }),
    check("minCapacity")
        .optional()
        .isInt({min: 0})
        .withMessage("Min capacity must be a number"),
    check("minRating")
        .optional()
        .isFloat({min: 0, max: 5})
        .withMessage("Min rating must be a number and between 0 and 5"),
    check("amenities")
        .optional()
        .isString()
        .withMessage("Amenities must be a string")
        .custom(amenities => {
            if (!amenities.includes(",")) {
                throw createError("Amenities must be comma separated");
            }
            return true;
        })
]

const searchPlaceValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if(Object.keys(mappedErrors).length === 0) next();
    else {
        res.status(400).json({
            errors: mappedErrors
        });
    }
}

module.exports = {
    searchPlaceValidator,
    searchPlaceValidationHandler
};