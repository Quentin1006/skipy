const { register } = require("../modules/register");
const { attachUserAndTokenToSession } = require("../modules/register/helper");


const authenticateRequest = async (req, res, next) => {
    const { auth_type, token_or_code, auth_provider, redirect_url } = req.body;

    const regInfos = await register({
        auth_type,
        provider: auth_provider,
        token_or_code,
        redirect_url,
    });

    attachUserAndTokenToSession(req, regInfos.user, regInfos.token);
    delete regInfos.token;

    res.send(regInfos);
}

const checkIfUserSession = (req, res, next) => {
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
    delete req.user;
    delete req.session.user;

    // On renvoie ce qu'il reste de l'user en espérant que ce soit le null
    res.send(req.user)
}

module.exports = {
    authenticateRequest,
    checkIfUserSession,
    logout
}