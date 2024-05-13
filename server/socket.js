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
        });

        socket.on("logout", (userId) => {
            socket.leave(userId);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
    return io;
}

module.exports = setupSocket;