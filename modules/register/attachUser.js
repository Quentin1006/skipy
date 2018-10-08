exports.attachUserToReq = (req, res, next) => {
    if(req.session && req.session.user){
        req.user = req.session.user;
    }

    next();
    
}

exports.attachUserToSession = (req, user) => {
    if(req.session)
        req.session.user = user
}

exports.verifyUser = (req, res, next) => {
    if(!req.user){
        res.status(401).send('Unauthorized')
    }
}