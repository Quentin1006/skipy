const socketio = require("socket.io");
const debug = require("debug")("socket:index");

const socketOpts = require("../config");

const messageSocket = require("./messages");

module.exports = (server) => {
    const io = socketio(server, socketOpts);

    // io.engine.generateId = (req) => {
    //     return req.session.user.id;
    // }

    messageSocket(io.of('/messages'));
};