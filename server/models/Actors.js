//External imports
const mongoose = require('mongoose');

//Schema for Actors
const ActorsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        isOwner: {
            type: Boolean,
            required: true,
        },
    }
)

//Model for Actors
const Actors = mongoose.model('Actors', ActorsSchema);

module.exports = Actors;