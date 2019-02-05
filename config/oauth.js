const appFacebookCreds = require("./secret").oauth.facebook

module.exports = {
    facebook: {
        appFacebookCreds,
        version : "v3.1",
        scope: {
            default: "id,first_name,last_name,picture,email"
        },
        redirect_uri: "login/"
    }
    
}