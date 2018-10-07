// Insérer ici les stratégies d'authentification des providers désirés
// les ajouter ensuite dans dans la boucle switch 
const creds = require("config").oauth;
const FBcreds = creds.facebook;
const { registerWithFB, use } = require("./facebook/FBregister")(FBcreds);
const db = require("db");

const register = async (authInfos) => {
    const { provider } = authInfos;
    let registeredUser = {};
    
    switch(provider) {
        case "facebook":
            use("checkIfUserExists", db.checkIfUserExists);
            use("addUser", db.addUser);
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