const qs = require("querystring");
const debug = require("debug")("test:FBRegister")

const FBappCreds = require("../../../../config").oauth.facebook;
const { user_mail, user_pwd } = require("../../../../config/secret").creds.facebook

const { registerWithFB, use } = require("../FBregister")(FBappCreds);
const getFBTokenWithPPTR = require("../../../../lib/OAuth/facebook/getFBTokenWithPPTR");

const { PROTOCOL, DOMAIN, PORT } = process.env;



const authInfosWithCode = {
    code: new Error("Enter a valid access code"),
    auth_type: "code",
    redirect_uri: `${PROTOCOL}://${DOMAIN}:${PORT}/login`,
    provider: "facebook"
}

const getAccessToken = async (email, pwd, client_id, redirect_uri) => {
    const uri = "https://www.facebook.com/v3.1/dialog/oauth";
    const params = qs.stringify({client_id, redirect_uri, response_type:"token"});
    console.log(`${uri}?${params}`);
    return (await getFBTokenWithPPTR(`${uri}?${params}`, email, pwd, redirect_uri))
}

use("checkIfUserExists", () => {
    debug("mock method to check if user exist");
    return false;
});

use("addUser", () => {debug("mock method to add user")});

describe("Testing registering with fb", () => {
    test("with Access token", async () => {
        const token = await getAccessToken(
            user_mail, 
            user_pwd, 
            FBappCreds.FBappCreds.client_id,
            FBappCreds.redirect_uri
        )

        const authInfosWithToken = {
            auth_type: "token",
            provider: "facebook",
            token_or_code: token,
        }
        try {
            const res = await registerWithFB(authInfosWithToken)
            expect(res).toHaveProperty("just_registered", true);
            expect(res).toHaveProperty("user")
        }
        catch(e) {
            console.log(e);
        }

        
    }, 10000)

    test.todo("with code")
})