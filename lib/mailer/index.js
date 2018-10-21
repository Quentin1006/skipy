const transporter = require("./transporter");
const preview = require("preview-email");
const templateEngine = require("./templateEngine");


module.exports = (transporterOpts, templateOpts={}) => {

    // We avoid passing the options ise templateOpts is galse
    if(!templateOpts.useTemplate){
        templateOpts = {};
    }

    const transport = transporter(transporterOpts, templateOpts);
    
    const buildMessage = async (message) => {
        if(templateOpts.useTemplate){
            const engine = new templateEngine(templateOpts);
            const { template, context } = message;
            const html = await engine.createTemplate(template, context) ;

            return {
                ...message,
                html
            }
        }
        // If we dont use template we return the message as it is
        return message;
    }

    
    const sendMail = async (message) => {
        const transporter = transport.getTransporter();
        const builtMess = await buildMessage(message);
        return transporter.sendMail(builtMess)
            .then(info => {console.log(info)})
            .catch(err => {console.log(err)/* handle error code */ })
    }


    const previewMail = async (message) => {
        const builtMess = await buildMessage(message);
        return preview(builtMess);
    }


    return {
        sendMail,
        previewMail,
    }
}



