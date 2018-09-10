const express = require('express');
const router = express.Router();

const { getUserFBdata } = require("../lib/facebook/oauth");


 
/* GET home page. */
router.post('/', (req, res, next) => {
    const accessToken = req.body.accessToken;

    getUserFBdata(accessToken)
        .then((res) => { console.log(res)});
});

module.exports = router;
