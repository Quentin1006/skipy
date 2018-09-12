const { transporterOpts } = require("../../../config");

const templateOpts = {
    viewEngine : {extname: '.hbs'},
    viewPath: "./lib/mailer/tests/",
    extName: ".hbs"
}

const { sendMail } = require("../")(transporterOpts, templateOpts);



sendMail({
    to: 'quentin.sahal@gmail.com',
    subject: 'Test',
    template: 'templateTest',
    context: {
        author: {
            firstName :'Quentin',
            lastName: 'Sahal'
        }
    }
});