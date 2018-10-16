const
    io = require("socket.io-client"),
    ioClient = io.connect("https://localhost:3001/messages", {rejectUnauthorized: false, secure:true});
   
   
    ioClient.on("conn", (id) =>{
        console.log("your socket id is", id);
    })

    ioClient.on("sendMessage response", (disc) => {
        console.log("your receive a message");
        console.log("socketClient2: sendMessage", disc);
    })
    