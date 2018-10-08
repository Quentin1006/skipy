const sessionOpts = require("./session");
const oauth = require("./oauth");
const corsOpts = require("./cors");
const { transporterOpts } = require("./mailer.js")

module.exports = {
    oauth,
    sessionOpts,
    transporterOpts,
    corsOpts
}