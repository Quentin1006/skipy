const http = require('http');


module.exports = (options) => {
    const port = options.port || process.env.PORT ||"443";

    return http.createServer((req, res) => {
        const redirAddr = `https://${req.headers.host}:${port}${req.url}`;
        console.log(redirAddr);
        res.writeHead(301, { "Location": redirAddr });
        res.end();
    });
}

