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

const chefIfUserSession = (req, res, next) =>{
    let objToSend = {};
    if(req.user){
        objToSend = {logged_in:true, user: req.user};
    }
    else {
        objToSend = {logged_in:false};
    }

    res.send(objToSend);
}

module.exports = {
    authenticateRequest,
    chefIfUserSession
}