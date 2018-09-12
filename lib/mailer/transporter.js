const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const { isEmpty } = require("lodash");

// If we generate our refresh token from the playground its important to add the client id and client secret in the settings
module.exports = (transporterOpts, templateOpts={}) => {
    const transporter = nodemailer.createTransport(transporterOpts);
    
    // 
    // transporter.set('oauth2_provision_cb', (user, renew, callback)=>{
    //     let accessToken = userTokens[user];
    //     if(!accessToken){
    //         return callback(new Error('Unknown user'));
    //     }
    //     else{
    //         return callback(null, accessToken);
    //     }
    // });
    console.log("isEmtpy= ", isEmpty(templateOpts))
    console.log(templateOpts);

    if(!isEmpty(templateOpts)){
        // Should verify that templateOpts is correctly formed
        console.log("using template");
        transporter.use('compile', hbs(templateOpts));
    }
    
    
    const getTransporter = () => transporter;

    const verifyTransporter = () => transporter.verify();


    return {
        getTransporter,
        verifyTransporter
    }   
}