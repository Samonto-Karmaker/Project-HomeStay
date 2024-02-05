//External Imports
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Internal Imports
const authRouter = require('./routes/authRouter');
const {pushDummyPlaces} = require('./controllers/placeController');
const placeRouter = require('./routes/placeRouter');

//Initialization
const app = express();
dotenv.config();

//Database Connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully...'))
.then(() => pushDummyPlaces())
.catch((err) => console.log(`Error: ${err}`));

//Request Parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Cookie Parser
app.use(cookieParser(process.env.COOKIE_SECRET));

//Routing
app.use("/api", authRouter)
app.use("/api/places", placeRouter)

//Enable all CORS requests
app.use(cors())

//Server listening
app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`);
});