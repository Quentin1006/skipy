const FBappCreds = require("./secret").oauth.facebook

module.exports = {
    facebook: {
        FBappCreds,
        version : "v3.1",
        scope: {
            default: "id,first_name,last_name,picture,email"
        },
        redirect_uri: "https://www.facebook.com/connect/login_success.html"
    }
    
}