const socketio = require("socket.io");
const debug = require("debug")("socket:index");

const { socketOpts } = require("../config");

const messageSocket = require("./messages");

module.exports = (server) => {
    const io = socketio(server, socketOpts);
    let id =1;

    io.engine.generateId = (req) => {
        console.log("in generate id");
        return id++;
    }

    messageSocket(io.of('/messages'));
};