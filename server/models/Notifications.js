//External imports
const mongoose = require('mongoose');

//Schema for Notifications
const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Actors",
            required: true,
        },
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

//Model for Notifications
const Notifications = mongoose.model('Notifications', notificationSchema);

module.exports = Notifications;
