const path = require("path");
const { transporterOpts, templateOpts } = require("../../../config").mailerOpts;
const mailer = require("../")(transporterOpts, templateOpts);
const { sendMail, previewMail } = mailer;
const { quentin } = require("../../../config/secret");

const filepath = path.resolve(__dirname, "../../../upload/jTS41cwdpPRuAIB1KZSjF4Uw0j02R4Pt.jpg");

const message = {
    to: quentin.email,
    subject: "Test",
    template: "test.template",
    html:"<h1>coucou</h1>",
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
};

( () => {
    previewMail(message)
        .then(() => sendMail(message))
        .catch(console.error)
        .then(process.exit);
    
})()
