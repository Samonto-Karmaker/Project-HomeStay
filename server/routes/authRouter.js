//External imports
const express = require("express")

//Internal Imports
const {register, login, logout, getAuthUser} = require("../controllers/authController")
const {registerValidator, registerValidatorHandler} = require("../middlewares/auth/register_validator")
const { checkAuth } = require("../middlewares/common/protectPages")
const avatarUploader = require("../middlewares/auth/avatarUploader")

//Initializing Router
const router = express.Router()

//Register
router.post(
    "/register",
    avatarUploader,
    registerValidator,
    registerValidatorHandler,
    register
)

//Login
router.post("/login", login)

//Logout
router.delete("/logout", logout)

//Check if user is logged in
router.get("/check-authentication", checkAuth, getAuthUser)

module.exports = router