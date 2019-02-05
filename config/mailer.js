const {resolve} = require("path");
const auth = require("./secret").mailer

console.log(resolve(__dirname, "../mailTemplates"));

module.exports = {
    transporterOpts : {
        port: 465,
        host: "smtp.gmail.com",
        auth
    },
    templateOpts: {
        useTemplate: true,
        viewEngine : {extname: '.hbs'},
        viewPath: resolve(__dirname, "../mailTemplates/"),
        extName: ".hbs"
    }
    
}