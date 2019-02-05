const { register } = require("../");


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

register(authInfosWithToken)
    .then(res => console.log("register", res))
    .catch(err => console.log("register err", err));