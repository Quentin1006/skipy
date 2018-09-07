const db = require("../../db");
const passport = require("passport");
const Facebook = require("./providers/facebook");


passport.serializeUser(function(user, done){
    done(null, user.authId);
});


module.exports = {}