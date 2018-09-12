const sessionOpts = require("./session");
const oauth = require("./oauth");
const { transporterOpts } = require("./mailer.js")

module.exports = {
    oauth,
    sessionOpts,
    transporterOpts
}