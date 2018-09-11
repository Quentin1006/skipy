const express = require('express');
const router = express.Router();
const db = require("../db");
const { authenticate } = require("../lib/authenticate");

router.post('/', authenticateRequest);
router.get('/',  checkIfLoggedIn);



async const authenticateRequest = (req, res, next) => {
    const { auth_type, access_token, auth_provider, redirect_url } = req.body;

    const user = await authenticate({
        auth_type,
        provider: auth_provider,
        access_token,
        redirect_url,
    });

    res.send(user);
}

const checkIfLoggedIn = (req, res, next) => {
    if(req.user){
        res.send({logged_in:true, user: req.user})
    }
    else {
        res.send({logged_in:false});
    }
}

module.exports = router;
