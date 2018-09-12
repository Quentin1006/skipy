const { transporterOpts } = require("../../../config");
const t = require("../transporter");
const { sendMail } = require("../")(transporterOpts);


// t.verifyTransporter()
//     .then(res => console.log("Server ready to mail"))
//     .catch(err => console.log(err));


//console.log(t.getTransporter());


sendMail({
    to:"quentin.sahal@gmail.com",
    subject:"message",
    text:"I hope this message get through"
})
