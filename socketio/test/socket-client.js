const io = require("socket.io-client");
const { PROTOCOL, DOMAIN, PORT } = process.env;
const ioClient = io.connect(
    `${PROTOCOL}://${DOMAIN}:${PORT}/messages`, 
    {rejectUnauthorized: false, secure:true}
);




ioClient.on("conn", (id) =>{
    console.log("your socket id is", id);
})

// ioClient.on("retrieveActiveDiscs", (discs) => {
//     console.log(discs);
// })

const recipientId = 1;

ioClient.emit("startDiscussion", recipientId);

ioClient.on("startDiscussion response", (createdDisc) => {
    console.log("startDiscussion", createdDisc);
    ioClient.emit("sendMessage", createdDisc.id, {to:recipientId, content:"goodbye boii"});

});

ioClient.on("sendMessage response", (disc) => {
    console.log("sendMessage", disc);
});

// ioClient.emit("sendMessage", 5, {to:2, content:"goodbye boii"});
// ioClient.emit("sendMessage", 5, {to:2, content:"second message"});
// ioClient.on("sendMessage response", (disc) => {
//     console.log("sendMessage", disc);
// })



// ioClient.emit("getDiscussion", 2);
// ioClient.on("getDiscussion response", (disc) => {
//     console.log("getDiscussion", disc);
// })

// ioClient.emit("markAsSeen", 2);
// ioClient.on("markAsSeen response", (disc) => {
//     console.log("markAsSeen", disc);
// })