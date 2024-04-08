// External Imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

//Internal Imports
const Actors = require("../../models/Actors");

const addPlaceValidators = [
    check("name")
        .isLength({ min: 1 })
        .withMessage("NameError: Name is required")
        .matches(/^[a-zA-Z][a-zA-Z\s-_]+$/)
        .withMessage(
            "NameError: Name must start with an alphabet and should only contain alphabets, whitespace, - and _"
        )
        .trim(),
    check("ownerId")
        .isMongoId()
        .withMessage("OwnerIdError: Owner ID is not valid")
        .custom(async (ownerId) => {
            try {
                const owner = await Actors.findById(ownerId);
                if (!owner) {
                    throw createError("OwnerIdError: Owner not found");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("images")
        .isArray({ min: 1 })
        .withMessage("ImagesError: At least one image is required"),
    check("city")
        .isLength({ min: 1 })
        .withMessage("CityError: City is required")
        .matches(/^[A-Z][a-zA-Z\s-]+$/)
        .withMessage(
            "CityError: City must start with an capital alphabet and should only contain alphabets, whitespace and -"
        )
        .trim(),
    check("country")
        .isLength({ min: 1 })
        .withMessage("CountryError: Country is required")
        .matches(/^[A-Z][a-zA-Z\s-]+$/)
        .withMessage(
            "CountryError: Country must start with an capital alphabet and should only contain alphabets, whitespace and -"
        )
        .trim(),
    check("description")
        .isLength({ min: 1 })
        .withMessage("DescriptionError: Description is required")
        .trim(),
    check("price")
        .isNumeric()
        .withMessage("PriceError: Price must be a number")
        .custom(price => {
            if (price <= 0) {
                throw createError("PriceError: Price must be greater than 0");
            }
            return true;
        }),
    check("amenities")
        .isArray({ min: 3 })
        .withMessage("AmenitiesError: At least three amenity is required"),
    check("capacity")
        .isNumeric()
        .withMessage("CapacityError: Capacity must be a number")
        .custom(capacity => {
            if (capacity <= 0) {
                throw createError("CapacityError: Capacity must be greater than 0");
            }
            return true;
        }),
];

const addPlaceValidationHandler = (req, res, next) => {
    // Get the errors from the request object
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    // If there is no error, then proceed to the next middleware
    if (Object.keys(mappedErrors).isLength === 0) next(); 

    // If there is an error, then delete the uploaded image and send the error message
    else {
        if (req.files.isLength > 0) {
            req.files.forEach(file => {
                unlink(path.join(__dirname, `/../public/images/Places${file.fileName}`), err => {
                    if (err) {
                        console.log(err);
                    }
                })
            });
        }
        res.status(500).json({
            errors: mappedErrors,
        });
    }
}

module.exports = {
    addPlaceValidators,
    addPlaceValidationHandler,
}
