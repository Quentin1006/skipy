const session = require("express-session");
const sharedsession = require("express-socket.io-session");
const { sessionOpts } = require("../config");
const debug = require("debug")("socketio:messages");

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

        // The user joins a room named after his id so its eaisier 
        // to direct messages toward him when necessary
        socket.join(`user#${userId}`);

        socket.emit("conn", `user#${userId}`);


        socket.on("retrieveActiveDiscs", () => {
            const activeDiscs = db.getUserActiveDiscussions(userId);
            socket.emit("retrieveActiveDiscs", activeDiscs);
        })

        socket.on("createDiscussion", (discOrFriendId, by) => {
            const disc = getDiscByDiscIdOrUsersId(discOrFriendId, by);
            
            socket.emit("createDiscussion response", disc);
        });
        

        socket.on("getDiscussion", (discOrFriendId, by) => {
            const disc = getDiscByDiscIdOrUsersId(discOrFriendId, by);
            
            socket.emit("getDiscussion response", disc);
        });


        socket.on("matchFriends", (value, nbSuggestion) => {
            const matches = db.getMatchingFriends(userId, value, nbSuggestion);
            socket.emit("matchFriends response", matches);
        })

        socket.on("sendMessage", (discId, msg) => {
            const receiver = msg.to;
            // on ne laisse pas la chance au client de modifier l'emetteur
            msg.from = userId;
            
            db.addDiscussionIfNotExist(userId, receiver);
            const builtMsg = db.addMessageToDiscussion(discId, msg);
            socket.emit("sendMessage response", builtMsg, discId);
            socket.to(`user#${receiver}`).emit("sendMessage response", builtMsg, discId);
        })

        socket.on("markAsSeen", (discId) => {
            const done = db.setAllDiscussionsMessagesAsRead(discId);
            socket.emit("markAsSeen response", discId, done);
        })



    })

}
