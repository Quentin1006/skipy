const env = process.env.NODE_ENV.toUpperCase().trim();
const { adminKey } = require("../../config");
const debug = require("debug")("register:helper");


exports.attachUserToReq = (req, res, next) => {
    if(req.session && req.session.user){
        req.user = req.session.user;
    }

    next();
    
}

exports.attachUserAndTokenToSession = (req, user, token) => {
    if(req.session){
        req.session.user = user;
        req.session.access_token = token;
    }
        
}

exports.verifyUser = (req, res, next) => {
    const adminKeyHeader = req.headers["adminkey"];
    debug("is env dev", env=== "DEVELOPMENT")
    debug("has admin key", adminKey === adminKeyHeader);
    if(req.user || (env === "DEVELOPMENT" && adminKeyHeader === adminKey)){
        next();
    }
    else{
        res.status(401).send({error:'Unauthorized', code:401})
    }
    
}