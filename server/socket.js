//External imports
const socketio = require('socket.io');

const setupSocket = (server) => {
    const io = socketio(server, {
        cors: {
            origin: process.env.CLIENT_URL,
        }
    });
    io.on("connection", (socket) => {
        console.log("New client connected");

        socket.on("login", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined`);
        });

        socket.on("logout", (userId) => {
            socket.leave(userId);
            console.log(`User ${userId} left`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
    return io;
}

module.exports = setupSocket;