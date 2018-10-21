const nodemailer = require("nodemailer");
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const debug = require("debug")("mailer:transporter");

// If we generate our refresh token from the playground its important to add the client id and client secret in the settings
module.exports = (transporterOpts, templateOpts={}) => {
    const transporter = nodemailer.createTransport(transporterOpts);

    transporter.use('compile', htmlToText());
    
    
    const getTransporter = () => transporter;

    const verifyTransporter = () => transporter.verify();


    return {
        getTransporter,
        verifyTransporter
    }   
}