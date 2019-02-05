const path = require("path");
const fs = require("fs");
const { transporterOpts } = require("../../../config").mailerOpts;
const mailer = require("..")(transporterOpts);
const { sendMail } = mailer;
const { quentin } = require("../../../config/secret");



const filepath = path.resolve(__dirname, "../../../upload/jTS41cwdpPRuAIB1KZSjF4Uw0j02R4Pt.jpg");

sendMail({
    to: quentin.email,
    subject:"message",
    html: `<p>I hope this message get through</p><img src="https://cdn.pixabay.com/photo/2015/07/20/12/53/man-852762_960_720.jpg"/>`,
    attachments: [{
        filename: "crazyfile.jpg",
        path: filepath,
        contentType: "image/jpeg"
    }]
})
.then(() => {
    process.exit(0);
})


