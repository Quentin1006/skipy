const transporter = require("./transporter");
const preview = require("preview-email");
const TemplateEngine = require("./templateEngine");


module.exports = (transporterOpts, templateOpts={}) => {


    const transport = transporter(transporterOpts);
    
    const buildMessage = (message) => {
        if(templateOpts.useTemplate){
            const engine = new TemplateEngine(templateOpts);
            const { template, context } = message;

            return engine.createTemplate(template, context)
                .then(html => ({
                    ...message,
                    html
                }));
        }
        // If we dont use template we return the message as it is in a promise
        return Promise.resolve(message);
    }

    
    const sendMail = (message) => {
        const transporter = transport.getTransporter();

        return buildMessage(message)
            .then(builtMess => transporter.sendMail(builtMess))
            .then(info => {console.log(info)})
            .catch(err => {throw new Error(err)})
        
    }


    const previewMail = (message) => {
        return buildMessage(message)
            .then(builtMess => preview(builtMess));
    }


    return {
        sendMail,
        previewMail,
    }
}



