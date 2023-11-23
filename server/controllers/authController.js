//External imports
const bcrypt = require('bcrypt');

//Internal imports
const Actors = require('../models/Actors');

//Register new user
const register = async (req, res, next) => {
    try {
        //Get data from request body
        const { name, email, mobile, password } = req.body;

        //Check if user already exists
        const user = await Actors.findOne({ email, mobile });

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create new user
        const newUser = new Actors({
            name,
            email,
            mobile,
            password: hashedPassword
        });

        try {
            await newUser.save();
            res.status(200).json({
                success: true,
                message: 'User created successfully',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Something went wrong while creating user',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

module.exports = {
    register,
}