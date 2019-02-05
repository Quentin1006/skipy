const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require("fs");
const path = require("path");
const secret = require("./secret").sessionSecret;
const sessionDir = path.resolve(__dirname, "../sessions");

const store = new FileStore({
    path: sessionDir,
})

const _readFileAsPromise = (path_) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path_, "utf8", (err, data) => {
            return err ? reject(err) : resolve(data);
        })
    })
}

exports.sessionOpts = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    
}


// working version
// to implement in case we use the fake provider
exports.getSessions = async () => {
    return new Promise((resolve, reject) => {
        store.list(async (err, files) => {
            err 
            ? reject(err)
            : resolve(
                await Promise.all(files.map(async (file) => {
                    const filePath = `${sessionDir}/${file}`;
                    const data_ = await _readFileAsPromise(filePath);
                    return JSON.parse(data_);
                }))
            )
            
        })
    })
}