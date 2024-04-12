//External imports
const mongoose = require("mongoose");

//Schema for Places
const placeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        ownerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Actors",
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        amenities: {
            type: [String],
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        isNotAvailableFrom: {
            type: Date,
        },
        isNotAvailableTo: {
            type: Date,
        },
        capacity: {
            type: Number,
            required: true,
        },
    }
);

//Model for Places
const Places = mongoose.model("Places", placeSchema);

module.exports = Places;
