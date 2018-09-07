const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const { findOrCreate } = require("../../../db/usersORM");

module.exports = (app, options) => {

    const init = () => {
        const env = app.get('env');
        const { facebook } = options;

        passport.use(new FacebookTokenStrategy({
            clientID: facebook.appID,
            clientSecret: facebook.appSecret,
            profileFields: facebook.scope,
            passReqToCallback: true
        }, findOrCreate));
    }


    const registerRoutes = () => {
        // register Facebook routes
        app.get('/facebook/token', passport.authenticate('facebook-token'), (req, res, next) => {
            // Put here the infos you want to send back to the user
            const resp = req.errAuth ? req.errAuth : req.user;
            res.send({err: req.errAuth, res: resp});

        });

    }

    return {
        init,
        registerRoutes
    }

}