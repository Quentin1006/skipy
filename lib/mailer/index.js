const transporter = require("./transporter");

module.exports = (transporterOpts) => {

    const transport = transporter(transporterOpts);
    
    const sendMail = (mailOpts) => {
        const transporter = transport.getTransporter();
        return transporter.sendMail(mailOpts)
            .then(info => {console.log(info)})
            .catch(err => { /* handle error code */ })
    }

    return {
        sendMail
    }
    
}



