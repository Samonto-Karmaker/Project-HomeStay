//Internal Imports
const Places = require('../models/Places');
const dummyPlaces = require('../data/place_data');

// Push Dummy data if necessary
const pushDummyPlaces = async () => {
    try {
        const placesCount = await Places.countDocuments();
        if (placesCount === 0) {
            await Places.insertMany(dummyPlaces);
            console.log('Dummy data pushed successfully!');
        } else {
            console.log('Places model is not empty. Skipping dummy data push.');
        }
    } catch (error) {
        console.error('Error pushing dummy data:', error);
    }
};

module.exports = {
    pushDummyPlaces,
};
