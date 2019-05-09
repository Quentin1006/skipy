const {sessionOpts, getSessions} = require("./session");
const oauth = require("./oauth");
const corsOpts = require("./cors");
const mailerOpts = require("./mailer.js");
const uploadOpts = require("./upload");
const httpsOpts = require("./https");
const socketioOpts = require("./socketio");

const { adminKey, pathToData } = require("./secret");

const hostname = `${process.env.DOMAIN}:${process.env.PORT}`;
const protocol = process.env.PROTOCOL;
const maxAvailableSessions = 490;



module.exports = {
    oauth,
    sessionOpts,
    getSessions,
    mailerOpts,
    corsOpts,
    adminKey,
    uploadOpts,
    httpsOpts,
    socketioOpts,
    pathToData,
    hostname,
    protocol,
    maxAvailableSessions,
}