const sessionOpts = require("./session");
const oauth = require("./oauth");
const corsOpts = require("./cors");
const { transporterOpts } = require("./mailer.js")
const adminKey = "dn6KL47PFTvip8RqxECtOcjyg19NGZmk";
const httpsOpts = require("./https");

module.exports = {
    oauth,
    sessionOpts,
    transporterOpts,
    corsOpts,
    adminKey,
    httpsOpts
}