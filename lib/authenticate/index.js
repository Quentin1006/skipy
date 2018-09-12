
const { authenticateWithFB } = require("./facebook/FBauthenticate");

const authenticate = async (authInfos) => {
    const { provider } = authInfos;
    let authenticatedUser = {};
    
    switch(provider) {
        case "facebook":
            await authenticateWithFB(authInfos)
            .then(user => {
                authenticatedUser = user
            });
            break;
        default:
            console.log("Unknown provider");
            break;
    }

    return authenticatedUser;
}



module.exports = {
    authenticate
}