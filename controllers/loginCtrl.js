const { register } = require("../modules/register");
const { attachUserToSession } = require("../modules/register/attachUser");


const authenticateRequest = async (req, res, next) => {
    const { auth_type, access_token, auth_provider, redirect_url } = req.body;

    const user = await register({
        auth_type,
        provider: auth_provider,
        access_token,
        redirect_url,
    });

    attachUserToSession(req, user);

    res.send(user);
}

const chefIfUserSession = (req, res, next) => {
    let objToSend = {};
    if(req.user){
        objToSend = {isLoggedIn:true, profile: req.user};
    }
    else {
        objToSend = {isLoggedIn:false};
    }

    res.send(objToSend);
}


const logout = (req, res, next) => {
    req.user = null;
    req.session.user = null;
}

module.exports = {
    authenticateRequest,
    chefIfUserSession,
    logout
}