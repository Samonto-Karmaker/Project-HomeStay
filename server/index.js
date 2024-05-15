//External Imports
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Internal Imports
const authRouter = require('./routes/authRouter');
const { pushDummyPlaces, isAvailabilityStatusValid } = require('./controllers/placeController');
const placeRouter = require('./routes/placeRouter');
const bookingRouter = require('./routes/bookingRouter');
const notificationRouter = require('./routes/notificationRouter');
const { setupSocket } = require("./socket");
const { checkBookingStatus, checkBookingVisit } = require('./controllers/bookingController');

//Initialization
const app = express();
dotenv.config();

//Database Connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully...'))
.then(() => {
    pushDummyPlaces();
    checkBookingStatus();
    checkBookingVisit();
    isAvailabilityStatusValid();
})
.catch((err) => console.log(`Error: ${err}`));

//Request Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({limit: "10mb", extended: true}));

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Cookie Parser
app.use(cookieParser(process.env.COOKIE_SECRET));

//Routing
app.use("/api", authRouter)
app.use("/api/places", placeRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/notifications", notificationRouter)

//Enable all CORS requests
app.use(cors())

//Server listening
const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`);
});

//Socket setup
const io = setupSocket(server);