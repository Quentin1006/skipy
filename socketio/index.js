const socketio = require("socket.io");
const debug = require("debug")("socket:index");

const { socketOpts } = require("../config");

const messageSocket = require("./messages");

module.exports = (server) => {
    const io = socketio(server, socketOpts);

    messageSocket(io.of('/messages'));
};