// Insérer ici les stratégies d'authentification des providers désirés
// les ajouter ensuite dans dans la boucle switch 
const creds = require("../../config").oauth;
const FBcreds = creds.facebook;
const { registerWithFB, use } = require("./facebook/FBregister")(FBcreds);
const db = require("../../db");

const register = async (authInfos) => {
    const { provider } = authInfos;
    let registerInfos = {};
    
    switch(provider) {
        case "facebook":
            use("checkIfUserExists", db.checkIfUserExists);
            use("addUser", db.addUser);
            await registerWithFB(authInfos)
            .then(res => {
                registerInfos = res;
            });
            break;
        default:
            console.log("Unknown provider");
            break;
    }

    return registerInfos;
}



module.exports = {
    register
}