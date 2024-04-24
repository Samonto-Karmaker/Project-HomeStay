// External imports
const express = require('express');

// Internal imports
const { checkAuth } = require('../middlewares/common/protectPages');
const { createBooking } = require('../controllers/bookingController');

// Initialize router
const router = express.Router();

router.post("/", checkAuth, createBooking);

exports.default = router;