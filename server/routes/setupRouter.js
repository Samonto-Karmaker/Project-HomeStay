// Internal Imports
const authRouter = require("./authRouter");
const placeRouter = require("./placeRouter");
const bookingRouter = require("./bookingRouter");
const notificationRouter = require("./notificationRouter");

const setupRouter = (app) => {
    //Routing
    app.use("/api", authRouter);
    app.use("/api/places", placeRouter);
    app.use("/api/bookings", bookingRouter);
    app.use("/api/notifications", notificationRouter);

    // Default Route
    app.get("/", (req, res) => {
        res.send("Welcome to the Project HomeStay Backend");
    });
    app.get("*", (req, res) => {
        res.status(404).send("Page Not Found");
    });
};

module.exports = setupRouter;
