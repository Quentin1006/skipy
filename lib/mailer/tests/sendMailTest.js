const { transporterOpts } = require("../../../config");
const { sendMail } = require("../")(transporterOpts);


sendMail({
    to:"quentin.sahal@gmail.com",
    subject:"message",
    text:"I hope this message get through"
})