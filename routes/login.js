const express = require('express');
const router = express.Router();
const db = require("../db");
const { register } = require("../modules/register");
const { attachUserToSession } = require("../modules/register/attachUser");

router.post('/', authenticateRequest);
router.get('/',  checkIfLoggedIn);



async function authenticateRequest(req, res, next){
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

function checkIfLoggedIn(req, res, next){
    if(req.user){
        res.send({logged_in:true, user: req.user})
    }
    else {
        res.send({logged_in:false});
    }
}

module.exports = router;