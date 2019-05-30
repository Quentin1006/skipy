const session = require("express-session");
const sharedsession = require("express-socket.io-session");
const { sessionOpts } = require("../config");
const { checkIfUser } = require("./helper")


const db = require("../db");


module.exports = (io) => {
    io.use(sharedsession(session(sessionOpts, { autoSave:true})));

    io.use(checkIfUser)
    

    io.on("connection", (socket) => {
        const sess = socket.handshake.session;
        const userId =  sess.user.id; 
        const sockName = `friendship#${userId}`

        // The user joins a room named after his id so its eaisier 
        // to direct messages toward him when necessary
        socket.join(sockName);

        socket.emit("connFriendship", sockName);

        socket.on("send friend request", (receiverId) => {
            if(!db.getUserById(receiverId)){
                const err = "No user matching this Id"
                socket.emit("send friend request response", {err});
                return;
            }
            
            const {err, res} = db.sendFriendRequest(userId, receiverId);
            if(res){
                socket.to(`friendship#${receiverId}`)
                      .emit("receive friend request", {err, res});
            }

            socket.emit("send friend request response", {err, res});
            return;
        });


        socket.on("answer friend request", (fromId, accepted) => {
            const {err, res} = db.answerFriendRequest(fromId, userId, accepted);
            if(res){
                socket.to(`friendship#${fromId}`)
                      .emit("answered friend request response", {err, res});
            }
            socket.emit("answer friend request response", {err, res});
            return;
        });


        socket.on("cancel friend request", (forId) => {
            const {err, res} = db.deleteFriendship(userId, forId);
            if(res){
                // Probably should remove the notification
                socket.to(`friendship#${forId}`)
                      .emit("canceled friend request response", {err, res})
            }
            socket.emit("cancel friend request response", {err, res});
        });
    })

}
