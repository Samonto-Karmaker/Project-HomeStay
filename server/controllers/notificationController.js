// Internal Imports
const Notification = require("../models/notificationModel");

// Get Notifications
const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        let notifications = await Notification.find({ userId: userId });
        if (notifications && notifications.length > 0) {
            res.status(200).json({
                success: true,
                message: "Notifications found",
                notifications: notifications,
            });
        } else {
            res.status(404).json({
                success: true,
                message: "No notifications found",
                notifications: [],
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    getNotifications,
}
