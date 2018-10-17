const session = require("express-session");
const sharedsession = require("express-socket.io-session");
const { sessionOpts } = require("../config");

const db = require("../db");

const socketIdToUserId = (socketId) => (Number((socketId.split("#"))[1]));

// AUCUN DE CES EVENTS N'EST REELLEMENT FONCTIONNEL 
// PLUS UN MEMO POUR SAVOIR COMMENT STRUCTURER LA SOCKET MESSAGE

module.exports = (io) => {
    io.use(sharedsession(session(sessionOpts)));
    

    io.on("connection", (socket) => {
        const sess = socket.handshake.session;
        socket.emit("conn", socket.id);

        const userId =  socketIdToUserId(socket.id); 
        const activeDiscs = db.getUserActiveDiscussions(userId);
        socket.emit("retrieveActiveDiscs", activeDiscs);

        socket.on("startDiscussion", withId => {
            const createdDisc = db.addDiscussion(userId, withId);
            socket.emit("startDiscussion response", createdDisc);
        })

        socket.on("getDiscussion", (discId) => {
            const disc = db.getDiscussion(discId);
            socket.emit("getDiscussion response", disc);
        });

        socket.on("sendMessage", (discId, msg) => {
            const receiver = msg.to;
            // on ne laisse pas la chance au client de modifier l'emetteur
            msg.from = userId;
            
            const builtMsg = db.addMessageToDiscussion(discId, msg);
            socket.emit("sendMessage response", builtMsg);
            socket.to(`/messages#${receiver}`).emit("sendMessage response", builtMsg);
        })

        socket.on("markAsSeen", (discId) => {
            const done = db.setAllDiscussionsMessagesAsRead(discId);
            socket.emit("markAsSeen response", done);
        })



    })

}
