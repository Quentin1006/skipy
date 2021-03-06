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
        const sockName = `search#${userId}`

        // The user joins a room named after his id so its eaisier 
        // to direct messages toward him when necessary
        socket.join(sockName);

        socket.emit("connSearch", sockName);

        socket.on("global search", (text) => {
            const matches = db.getUsersByName(text);
            const fshipStatus = matches.reduce((acc, person) => {
                const status = db.getFriendshipStatus(userId, person.id);
                
                if(status.initBy === userId){
                    status.initBy = "YOU";
                }

                return {
                    ...acc,
                    [person.id]: status
                }
            }, {});
            socket.emit("global search response", matches, fshipStatus);
        })
    })
}
