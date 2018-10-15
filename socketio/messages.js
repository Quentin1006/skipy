const session = require("express-session");
const sharedsession = require("express-socket.io-session");
const { sessionOpts } = require("../config");

const db = require("../db");

// AUCUN DE CES EVENTS N'EST REELLEMENT FONCTIONNEL 
// PLUS UN MEMO POUR SAVOIR COMMENT STRUCTURER LA SOCKET MESSAGE

module.exports = (io) => {
    io.use(sharedsession(session(sessionOpts)));
    io.use((socket, next) => {
        const session = socket.handshake.session
        if(!session.user){
            session.user = {
                "id": "fb10155921253140692",
                "firstname": "Quentin",
                "username": "Quentin",
                "email": "quentin.sahal@gmail.com",
                "lastname": "Sahal",
                "provider": "facebook",
                "token": "EAAcHDCqVtGgBABDMZC55CUsNihJOFUyP8YEkdIZA1xkmsmoCQFakSck9r02VIw8BZCVDCHkX6C1Kgtl8GuVxKnUuVUoMpZCwGu7Pr7vwyLy4qVEYYvxZAQYvoZCq1bT4XvpWfT9uZClLw9ncVK4ANXhpL4PsWhtNgvFwXCDZAw6y4w2LScQGqZAjYqzb1BpGwfuUbGdVr2IYLo2oAEAoAUAjNEwy46Q4uYEKtfwI2d7rkLgZDZD",
                "profilepicture": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10155921253140692&height=50&width=50&ext=1539431996&hash=AeT_xd8xpiaNwjcl",
                "status": "",
                "notifications": []
            }
        }
        next();
    })

    io.on("connection", (socket) => {
        const sess = socket.handshake.session;

        const userId = sess.user.userId || 0 ; 
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
            socket.to(receiver).emit("sendMessage response", builtMsg);
        })

        socket.on("markAsSeen", (discId) => {
            const done = db.setAllDiscussionsMessagesAsRead(discId);
            socket.emit("markAsSeen response", done);
        })



    })

}
