const debug = require("debug")("socketio:helper");

const checkIfUser = (socket, next) => {
    const sess = socket.handshake.session;
    if(!sess.user){
        debug("No user attached to session, We close the socket");
        socket.disconnect();
        return;
    }
    next();
}

module.exports = {
    checkIfUser
}