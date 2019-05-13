const session = require("express-session");
const sharedsession = require("express-socket.io-session");
const { sessionOpts } = require("../config");
const debug = require("debug")("socketio:search");

const db = require("../db");

//const socketIdToUserId = (socketId) => (Number((socketId.split("#"))[1]));

const getDiscByDiscIdOrUsersId = (discOrFriendId, by) => {
    return  (by === "users")
            ? db.discussionExists(userId, discOrFriendId)
            : db.getDiscussion(discOrFriendId);
}

module.exports = (io) => {
    io.use(sharedsession(session(sessionOpts, { autoSave:true})));

    io.use((socket, next) => {
        const sess = socket.handshake.session;
        if(!sess.user){
            debug("No user attached to session, We close the socket");
            socket.disconnect();
            return;
        }
        next();
    })
    

    io.on("connection", (socket) => {
        const sess = socket.handshake.session;
        const userId =  sess.user.id; 
        const sockName = `search#${userId}`

        // The user joins a room named after his id so its eaisier 
        // to direct messages toward him when necessary
        socket.join(sockName);

        socket.emit("connSearch", sockName);

        socket.on("global search", (text) => {
            const matches = db.getUsersByName(text);
            const fshipStatus = matches.reduce((acc, person) => {
                const status = db.getFriendshipStatus(userId, person.id);
                return {
                    ...acc,
                    [person.id]: status
                }
            }, {});
            socket.emit("global search response", matches, fshipStatus);
        })


    })

}
