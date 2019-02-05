require("app-module-path").addPath(process.cwd());

const creds = require("config").oauth.facebook
const { registerWithFB, use } = require("../FBregister")(creds);
const db = require("db");

const authInfosWithToken = {
    access_token: new Error("Enter a valid access token"),
    auth_type: "token",
    provider: "facebook"
}

const authInfosWithCode = {
    code: new Error("Enter a valid access code"),
    auth_type: "code",
    redirect_uri: "http://localhost:3001/login",
    provider: "facebook"
}

use("checkIfUserExists", db.checkIfUserExists);
use("addUser", db.addUser);


registerWithFB(authInfosWithCode)
    .then(res =>{
        console.log("registerWithFB", res)
    })
    .catch(err => {
        console.log("registerWithFB err", err)
    });