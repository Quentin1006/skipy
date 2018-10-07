// Insérer ici les stratégies d'authentification des providers désirés
// les ajouter ensuite dans dans la boucle switch 
const creds = require("config").oauth;
const FBcreds = creds.facebook;
const { registerWithFB } = require("./facebook/FBregister")(FBcreds);

const register = async (authInfos) => {
    const { provider } = authInfos;
    let registeredUser = {};
    
    switch(provider) {
        case "facebook":
            await registerWithFB(authInfos)
            .then(user => {
                registeredUser = user
            });
            break;
        default:
            console.log("Unknown provider");
            break;
    }

    return registeredUser;
}



module.exports = {
    register
}