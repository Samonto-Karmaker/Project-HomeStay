//External Imports
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

//Internal Imports
const authRouter = require('./routes/authRouter');

//Initialization
const app = express();
dotenv.config();

//Database Connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully...'))
.catch((err) => console.log(`Error: ${err}`));

//Request Parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Cookie Parser
app.use(cookieParser(process.env.COOKIE_SECRET));

//Routing
app.use("/", authRouter)

//Error Handler
//Default Error Handler

//404: Not Found

//Server listening
app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`);
});