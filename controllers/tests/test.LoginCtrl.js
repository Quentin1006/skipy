process.env.NODE_ENV = "development";

const { generate } = require("randomstring");
const assert = require("assert");
const qs = require("querystring")
const getFBTokenWithPPTR = require("../../lib/OAuth/facebook/getFBTokenWithPPTR");

const Session = function(){
    this.id = generate(8);
};


let globalSession = new Session()

// With the globalSession declared we can now simulate a request with or without a session
const Request = function(useGlobalSession=true) {
    this.session = useGlobalSession ? globalSession : new Session();
};


const Response = function(){};
Response.prototype.send = (json) => {
    this.json = json; 
    console.log(json);
}

const {
    authenticateRequest,
    checkIfUserSession,
    logout
} = require("../loginCtrl");


const secret =  require("../../config/secret")
// client_id de l'app
const { client_id } = secret.oauth.facebook;
// Identifiants pour se connecter à son compte facebook
const { user_mail, user_pwd } = secret.creds.facebook;
// adresse utilisée par défaut, ajoutée comme redirection possible de l'app
// Nous avons simplement besoin de récupérer le code
const redirect_uri = "https://www.facebook.com/connect/login_success.html";


const body = (token) => {
    return {
        auth_type:"token",
        auth_provider: "facebook",
        token_or_code:token,
        redirect_url:redirect_uri,
    }
};

/**
 * @param  {email} email The email of the user we want the user token from
 * @param  {string} pwd password matching the email
 * @param  {client_id} client_id The client_id of the app making the request
 * @param  {url} redirect_uri the url the token is send back to 
 */
const getAccessToken = async (email, pwd, client_id, redirect_uri) => {
    const uri = "https://www.facebook.com/v3.1/dialog/oauth";
    const params = qs.stringify({client_id, redirect_uri, response_type:"token"});
    console.log(`${uri}?${params}`);
    return (await getFBTokenWithPPTR(`${uri}?${params}`, email, pwd, redirect_uri))
}


const testAuthenticateRequest = async(user_mail, user_pwd, client_id, redirect_uri) => {    
    const token = await getAccessToken(user_mail, user_pwd, client_id, redirect_uri);

    return async (req, res) => {
        req.body = body(token);
        await authenticateRequest(req, res);
        assert(globalSession.user !== undefined, "globalSession should contain a user");
    }
    
}


/**
 * For functional tests
 */
const testCheckIfUserSession = () => {
    return (req, res) => {
        checkIfUserSession(req, res);
    }
}


const testLogout = () => {
    return (req, res) => {
        const isUser = !!req.session.user
        logout(req, res);
        assert(isUser && !req.session.user, "No user should be present after logout");
    };
    
}


const testAuthenticateProcess = async (reuseSession=true) => {
    const req = new Request(reuseSession)
    const res = new Response();

    testCheckIfUserSession()(req, res);
    await (await testAuthenticateRequest(user_mail, user_pwd, client_id, redirect_uri))(req, res);
    testCheckIfUserSession()(req, res);
    testLogout(false)(req, res);
    testCheckIfUserSession()(req, res);

}


(async() => { 
    try{
        await testAuthenticateProcess();
    }
    catch(e){
        console.log(e);
    }
    process.exit(0);
})()

