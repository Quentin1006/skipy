const { fork } = require("child_process");
const {
    testGetAccessTokenFromCode,
    testExtendExpiryToken,
    testInspectToken,
    testGetAppAccessToken,
    testGetUserFBData,
    testCheckPermissions
} = require("./testFunctions");


const redirect_uri = "http://localhost:3000/login";
const scope = "id,name,email,friends";
const client_id = "1978073672430696";
const request_code_url = `https://www.facebook.com/v3.1/dialog/oauth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
const user_mail = "quentin.sahal@epfl.ch";
const user_pwd = "h4t0s1qs";



const req = fork("./runCodeReq.js", [request_code_url, user_mail, user_pwd]);

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










    
