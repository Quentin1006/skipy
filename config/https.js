const fs = require("fs");
const { resolve } = require("path")

module.exports = {
    key: fs.readFileSync(resolve(__dirname, "cert/server-key.pem")),
    cert: fs.readFileSync(resolve(__dirname, "cert/server-cert.pem"))
}