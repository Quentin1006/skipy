const socketio = require("socket.io");

const { socketOpts } = require("../config");

const messageSocket = require("./messages");
const searchSocket = require("./search");
const friendshipSocket = require("./friendship");
const notificationSocket = require("./notification");

module.exports = (server) => {
    const io = socketio(server, socketOpts);

    messageSocket(io.of('/messages'));
    searchSocket(io.of('/search'));
    friendshipSocket(io.of('/friendship'));
    notificationSocket(io.of('/notification'));
};