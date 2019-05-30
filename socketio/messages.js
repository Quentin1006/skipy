const session = require("express-session");
const sharedsession = require("express-socket.io-session");
const { sessionOpts } = require("../config");
const { checkIfUser } = require("./helper")

const db = require("../db");

//const socketIdToUserId = (socketId) => (Number((socketId.split("#"))[1]));

const getDiscByDiscIdOrUsersId = (discOrFriendId, by) => {
    return  (by === "users")
            ? db.discussionExists(userId, discOrFriendId)
            : db.getDiscussion(discOrFriendId);
}

module.exports = (io) => {
    io.use(sharedsession(session(sessionOpts, { autoSave:true})));

    io.use(checkIfUser)
    

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


        socket.on("matchFriends", (value, nbSuggestions) => {
            const matches = db.getMatchingSuggestions(userId, value, nbSuggestions || 3);
            socket.emit("matchFriends response", matches);
        })

        socket.on("sendMessage", (discId, msg) => {
            const receiver = msg.to;

            if(!receiver)
                return;

            // on ne laisse pas la chance au client de modifier l'emetteur
            msg.from = userId;
            
            const disc = db.addDiscussionIfNotExist(userId, receiver);
            const builtMsg = db.addMessageToDiscussion(disc.id, msg);

            const resp = {
                builtMsg, 
                discUpdatedId: disc.id, 
                discRequestedId: discId
            };

            socket.emit("sendMessage response", resp);
            socket.to(`user#${receiver}`).emit("sendMessage response", resp);
        })

        socket.on("markAsSeen", (discId) => {
            const done = db.setAllDiscussionsMessagesAsRead(discId, userId);
            socket.emit("markAsSeen response", discId, done);
        })



    })

}
