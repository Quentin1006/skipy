// Insérer ici les stratégies d'authentification des providers désirés
// les ajouter ensuite dans dans la boucle switch 
const config = require("../../config")
const creds = config.oauth;
const FBcreds = creds.facebook;
const { getSessions, maxAvailableSessions } = config;
const { registerWithFB, use: fbUse } = require("./facebook/FBregister")(FBcreds);
const { registerWithFake, use: fkUse } = require("./fake/registerWithFake")(maxAvailableSessions);

const db = require("../../db");

const register = async (authInfos) => {
    const { provider } = authInfos;
    let registerInfos = {};
    
    switch(provider) {
        case "facebook":
            fbUse("checkIfUserExists", db.checkIfUserExists);
            fbUse("addUser", db.addUser);
            registerInfos = await registerWithFB(authInfos)
            break;

        case "fake": 
            fkUse("getUserById", db.getUserById);
            fkUse("getSessions", getSessions);
            registerInfos = await registerWithFake(authInfos);
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