const { fork } = require("child_process");
const {
    testGetAccessTokenFromCode,
    testExtendExpiryToken,
    testInspectToken,
    testGetAppAccessToken,
    testGetUserFBData,
    testCheckPermissions
} = require("./testFunctions");

// adresse utilisée par défaut, ajoutée comme redirection possible de l'app
// Nous avons simplement de récupérer le code
const redirect_uri = "https://www.facebook.com/connect/login_success.html";
const scope = "id,name,email,friends";
// client_id de l'app
const client_id = "1978073672430696";
// url to fetch to get the authorization code
const request_code_url = `https://www.facebook.com/v3.1/dialog/oauth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;

// Identifiants pour se connecter à son compte facebook
const user_mail = "quentin.sahal@epfl.ch";
const user_pwd = "h4t0s1qs";


console.log(`
 ***********************************************************************************
 *****************************      ATTENTION        *******************************
 ***********************************************************************************
 
    La fonction de récupération du code d'autorisation n'arrive pour 
    l'instant pas à récupérer le code en incluant les permissions demandées.
    Ne pas inclure le scope sous peine que le script plante complètement

 ***********************************************************************************
 ***********************************************************************************
 ***********************************************************************************
`)


const req = fork("./runCodeReq.js", [request_code_url, user_mail, user_pwd, redirect_uri]);

req.on("message", code => {
    testGetAccessTokenFromCode(code, redirect_uri)
    .then(token => {
        const {access_token} = token;

        Promise.all([
            testExtendExpiryToken(access_token),
            testGetUserFBData(access_token, scope),
            testInspectToken(access_token),
            testGetAppAccessToken(),
        ])
        .then((values) => {
            const user_id = values[1].id;
            testCheckPermissions(access_token, user_id);
        })
        .catch(err=>err)
        .then(() => {
            console.log("Done.");
            process.exit(0);
        })
    })
    .catch(err=> process.exit(err))
})










    
