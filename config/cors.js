const secret = require("./secret");
const corsWhitelist = secret.corsWhitelist.split(" ");

module.exports = {
    origin: function(origin, cb){
        if (corsWhitelist.indexOf(origin) !== -1 ) {
            cb(null, true)
        } 
        else {
            cb(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    maxAge: 86400,
    optionsSuccessStatus: 200
}