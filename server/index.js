//External Imports
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Internal Imports
const { setupSocket } = require("./socket");
const setupDB = require('./setupDB');
const setupRouter = require('./routes/setupRouter');

//Initialization
const app = express();
dotenv.config();

//Database Connection
setupDB().then(() => {
    console.log("Database setup complete.");
}).catch(err => {
    console.error("Error setting up database:", err);
});

//Request Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({limit: "10mb", extended: true}));

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Cookie Parser
app.use(cookieParser(process.env.COOKIE_SECRET));

//Router setup
setupRouter(app);

//Enable all CORS requests
app.use(cors())

//Server listening
const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`);
});

//Socket setup
const io = setupSocket(server);