//External imports
const express = require("express")

//Internal Imports
const {register} = require("../controllers/authController")
const {registerValidator, registerValidatorHandler} = require("../middlewares/auth/register_validator")

//Initializing Router
const router = express.Router()

//Register
router.post(
    "/register",
    registerValidator,
    registerValidatorHandler,
    register
)

//Login
router.post("/login", login)

//Logout
router.delete("/logout", logout)

module.exports = router