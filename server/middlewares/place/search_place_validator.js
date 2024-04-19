const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const searchPlaceValidator = [
    check("city")
        .isLength({ min: 1 })
        .isString()
        .withMessage("City must be a string")
        .matches(/^[A-Z][a-zA-Z\s-]*$/)
        .withMessage(
            "CityError: City must start with an capital alphabet and should only contain alphabets, whitespace and -"
        )
        .trim(),
    check("country")
        .isLength({ min: 1 })
        .withMessage("Country is required")
        .isString()
        .withMessage("Country must be a string")
        .matches(/^[A-Z][a-zA-Z\s-]+$/)
        .withMessage(
            "CountryError: Country must start with an capital alphabet and should only contain alphabets, whitespace and -"
        )
        .trim(),
    check("minPrice")
        .optional()
        .isNumeric({min: 0})
        .withMessage("Min price must be a number"),
    check("maxPrice")
        .optional()
        .isNumeric({min: 0})
        .withMessage("Max price must be a number")
        .custom((maxPrice, { req }) => {
            if (Number(maxPrice) > 0 && Number(maxPrice) < Number(req.body.minPrice)) {
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
        .isArray()
        .withMessage("Amenities must be an array"),
    check("amenities.*")
        .isString()
        .withMessage("Amenity must be a string")
        .matches(/^[a-zA-Z\s-]*$/)
        .withMessage(
            "AmenityError: Amenity must only contain alphabets, whitespace and -"
        )
        .trim(),
]

const searchPlaceValidationHandler = (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    console.log(mappedErrors);

    if(Object.keys(mappedErrors).length === 0) next();
    else {
        console.log(mappedErrors);
        res.status(400).json({
            errors: mappedErrors,
        });
    }
}

module.exports = {
    searchPlaceValidator,
    searchPlaceValidationHandler
};