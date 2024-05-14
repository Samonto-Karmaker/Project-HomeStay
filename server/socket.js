//External imports
const socketio = require('socket.io');

let users = {};

const setupSocket = (server) => {
    const io = socketio(server, {
        cors: {
            origin: process.env.CLIENT_URL,
        }
    });
    io.on("connection", (socket) => {
        console.log(`New client: ${socket.id} connected`);

        socket.on("login", (userId) => {
            users[userId] = socket;
            socket.join(userId);
            console.log(`User ${userId}: ${socket.id} joined`);
        });

        socket.on("reconnect", (userId) => {
            console.log("Reconnect request received");
            if(!users[userId]){
                users[userId] = socket;
                socket.join(userId);
                console.log(`User ${userId}: ${socket.id} joined again`);
            }
        })

        socket.on("logout", (userId) => {
            delete users[userId];
            socket.leave(userId);
            console.log(`User ${userId}: ${socket.id} left`);
        });

        socket.on("disconnect", () => {
            console.log(`Client ${socket.id} disconnected`);
        });
    });
    return io;
}

const emitNotification = (userId, notification) => {
    const userSocket = users[userId];
    if(userSocket){
        userSocket.emit("notification", notification);
        console.log("YES!!!!!!!!")
    }
}

module.exports = {
    setupSocket,
    emitNotification,
};