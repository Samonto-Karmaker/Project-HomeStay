//External imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

//Login user
const login = async (req, res, next) => {
    try{
        const user = await Actors.findOne({
            $or: [
                { email: req.body.email }, 
                { mobile: req.body.mobile }
            ]
        })
        if(user && user._id){
            const isValidPassword = await bcrypt.compare(
                req.body.password, 
                user.password
            );
            if(isValidPassword) {
                const userObject = {
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    isOwner: user.isOwner,
                }
                const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY
                });
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly: true,
                    signed: true
                });
                res.status(200).json({
                    success: true,
                    message: 'User logged in successfully',
                    loggedInUser: userObject,
                });
            }
            else{
                res.status(401).json({
                    success: false,
                    message: 'Invalid Password',
                });
            }
        }
        else{
            res.status(401).json({
                success: false,
                message: 'Invalid Credentials',
            });
        }
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

//Logout
const logout = (req, res, next) => {
    try{
        res.clearCookie(process.env.COOKIE_NAME);
        res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

module.exports = {
    register,
    login,
    logout
}