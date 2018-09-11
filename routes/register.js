const express = require('express');
const router = express.Router();
const db = require("../db");
s


 
/* GET home page. */
router.post('/', (req, res, next) => {
    const { accessToken, authProvider } = req.body;

    if(hasToRegister){
        getUserFBdata(accessToken)
            .then((res) => { });
    }

    
});


router.get('/', (req, res, next) => {
    if(req.user){
        res.send({logged_in:true, user: req.user})
    }
    else {
        res.send({logged_in:false});
    }
});
module.exports = router;
