const path = require("path");
const { transporterOpts, templateOpts } = require("../../../config").mailerOpts;
const mailer = require("../")(transporterOpts, templateOpts);
const { quentin } = require("../../../config/secret");
const { sendMail } = mailer;

const filepath = path.resolve(__dirname, "../../../upload/jTS41cwdpPRuAIB1KZSjF4Uw0j02R4Pt.jpg");

sendMail({
    to: quentin.email,
    subject: "Test",
    template: "test.template",
    context: {
        author: {
            firstName :"Quentin",
            lastName: "Sahal",
            picture: "https://cdn.pixabay.com/photo/2015/07/20/12/53/man-852762_960_720.jpg"
        }
    },
    attachments: [
        {
            filename: "crazyfile.jpg",
            path: filepath,
            contentType: "image/jpeg"
        }
    ]
})
.then( ()=> process.exit(0))