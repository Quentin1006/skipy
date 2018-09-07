const express = require('express');
const router = express.Router();

const { Facebook } = require("fb");


 
/* GET home page. */
router.post('/', (req, res, next) => {
    const accessToken = req.body.accessToken;
    const FB = new Facebook();

    FB.api("me", { access_token: accessToken }, (res) => {
        console.log(res)
        // create or retrieve user 
        // attach user info to session
    })
});

module.exports = router;
