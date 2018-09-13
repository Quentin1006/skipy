const transporter = require("./transporter");

module.exports = (transporterOpts, templateOpts={}) => {

    const transport = transporter(transporterOpts, templateOpts);
    
    const sendMail = (mailOpts) => {
        const transporter = transport.getTransporter();
        return transporter.sendMail(mailOpts)
            .then(info => {console.log(info)})
            .catch(err => {console.log(err)/* handle error code */ })
    }

    return {
        sendMail
    }
    
}



