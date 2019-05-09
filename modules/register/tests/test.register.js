const { register } = require("../");
const { PROTOCOL, DOMAIN, PORT } = process.env;


const authInfosWithToken = {
    access_token: new Error("Enter a valid access token"),
    auth_type: "token",
    provider: "facebook"
}

const authInfosWithCode = {
    code: new Error("Enter a valid access code"),
    auth_type: "code",
    redirect_uri: `${PROTOCOL}://${DOMAIN}:${PORT}/login`,
    provider: "facebook"
}


test.todo("Test register function")


// register(authInfosWithToken)
// .then(res => console.log("register", res))
// .catch(err => console.log("register err", err));
