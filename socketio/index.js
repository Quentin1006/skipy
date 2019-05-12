const socketio = require("socket.io");
const debug = require("debug")("socket:index");

const { socketOpts } = require("../config");

const messageSocket = require("./messages");
const searchSocket = require("./search");

module.exports = (server) => {
    const io = socketio(server, socketOpts);

    messageSocket(io.of('/messages'));
    searchSocket(io.of('/search'));
};