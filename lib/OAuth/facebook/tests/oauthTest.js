const optimist = require("optimist");
const argv = optimist.argv;
// Identifiants pour se connecter à son compte facebook
const user_email = argv.email || argv.e;
const user_pwd = argv.pwd || argv.p;

const { fork } = require("child_process");
const {
    testGetAccessTokenFromCode,
    testTokenDependantFunctions,
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

// We fork a new process that will get the token 
const req = fork("./getFBToken.js", [
    request_code_url, 
    user_email, 
    user_pwd, 
    redirect_uri
]);

// When the new process retrieved the token it sends it back 
// to the parent process via the message event
req.on("message", code => {
    testGetAccessTokenFromCode(code, redirect_uri)
    .then(token => {
        const {access_token} = token;
        testTokenDependantFunctions(access_token, scope)
        .then(() => {
            console.log("Done.");
            process.exit(0);
        })
    })
    .catch(err=> process.exit(err))
})












    
