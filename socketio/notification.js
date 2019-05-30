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
        const sockName = `notification#${userId}`

        // The user joins a room named after his id so its eaisier 
        // to direct messages toward him when necessary
        socket.join(sockName);

        socket.emit("connNotification", sockName);

        // "to" is the one we should notify
        socket.on("add notif", ({content, type, to}) => {
            const {err, res} = db.createNotification(
                to, {content, type, from:userId}
            );

            if(res){
                socket.to(`notification#${to}`)
                      .emit("receive notif", {res})
            }

            socket.emit("add notif response", {err, res})
        })

    
    })

}
