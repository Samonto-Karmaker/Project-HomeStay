//External Imports
const {check, validationResult} = require('express-validator');
const createError = require('http-errors');

//Internal Imports
const Actors = require('../../models/Actors');

//Register validator
const registerValidator = [
    check('name')
        .isLength({min: 1})
        .withMessage('NameError: Name is required')
        .matches(/^[a-zA-Z ][a-zA-Z\s-_]+$/)
        .withMessage("NameError: Name must start with an alphabet and should only contain alphabets, whitespace, - and _")
        .trim(),
    check('email')
        .isEmail()
        .withMessage('EmailError: Please enter a valid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await Actors.findOne({email: value});
                if (user) {
                    throw createError('EmailError: Email already in use');
                }
            } catch (error) {
                throw createError(error.message);
            }
        }),
    check('mobile')
        .isMobilePhone()
        .withMessage('MobileError: Please enter a valid mobile number')
        .custom(async (value) => {
            try {
                const user = await Actors.findOne({mobile: value});
                if (user) {
                    throw createError('MobileError: Mobile number already in use');
                }
            } catch (error) {
                throw createError(error.message);
            }
        }),
    check('password')
        .isStrongPassword()
        .withMessage('PasswordError: Password must be at least 8 characters long and should contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol'),
]

//Register validator handler
const registerValidatorHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if(Object.keys(mappedErrors).length === 0){
        next();
    }
    else{
        res.status(500).json({
            errors: mappedErrors,
        });
    }
}

module.exports = {
    registerValidator,
    registerValidatorHandler,
}