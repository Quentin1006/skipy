const fs = require("fs");
const { httpsCertKey, httpsCert } = require("./secret");
const { resolve } = require("path");


module.exports = {
    // key: fs.readFileSync(resolve(__dirname, "cert/server-key.pem")),
    // cert: fs.readFileSync(resolve(__dirname, "cert/server-cert.pem"))
    key: httpsCertKey,
    cert: httpsCert

}
