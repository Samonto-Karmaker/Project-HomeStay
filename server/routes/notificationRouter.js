// External imports
const express = require("express");

// Internal imports
const { checkAuth } = require("../middlewares/common/protectPages");
const { getNotifications } = require("../controllers/notificationController");

// Initialize router
const router = express.Router();

router.get("/", checkAuth, getNotifications);

module.exports = router;