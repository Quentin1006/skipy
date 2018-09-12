const nodemailer = require("nodemailer");

// If we generate our refresh token from the playground its important to add the client id and client secret in the settings
module.exports = (transporterOpts) => {
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
    
    
    const getTransporter = () => transporter;

    const verifyTransporter = () => transporter.verify();


    return {
        getTransporter,
        verifyTransporter
    }   
}