const
    io = require("socket.io-client"),
    ioClient = io.connect("http://localhost:3001/messages");

ioClient.on("retrieveActiveDiscs", (discs) => {
    console.log(discs);
})

ioClient.emit("startDiscussion", 2);
ioClient.on("startDiscussion response", (createdDisc) => {
    console.log("startDiscussion", createdDisc);
})

ioClient.emit("sendMessage", 5, {to:2, content:"goodbye boii"});
ioClient.emit("sendMessage", 5, {to:2, content:"second message"});
ioClient.on("sendMessage response", (disc) => {
    console.log("sendMessage", disc);
})



ioClient.emit("getDiscussion", 2);
ioClient.on("getDiscussion response", (disc) => {
    console.log("getDiscussion", disc);
})

ioClient.emit("markAsSeen", 2);
ioClient.on("markAsSeen response", (disc) => {
    console.log("markAsSeen", disc);
})