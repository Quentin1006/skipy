const fetch = require("cross-fetch");
const fs = require("fs");
const path = require("path");
const randomstring = require("randomstring");
const detectExtension = require("./detectExt");

const uploadFolder = "/upload";

const defaultDest = path.join(process.cwd(), uploadFolder);

const getFileInfos = (pathname) => {
    return new Promise((resolve, reject) => {
        fs.stat(pathname, (err, stats) => {
            if(err) reject(err);
            else resolve(stats);
        })
    })
}


const downloadImage = (url, { 
    imgName=randomstring.generate(), 
    ext="",
    dest=defaultDest,
    fetchOpts={}
}) => {

    return fetch(url, fetchOpts)
        .then(res => {
            return new Promise((resolve, reject) => {
                if (res && (res.status === 200 || res.status === 201)) {
                    const buffers = []
                    const filePath = path.join(dest, `${imgName}`);
                    const endStream = fs.createWriteStream(filePath);
                    const { body } = res;

                    body.on("data", chunk => 
                        buffers.push(chunk)
                    );
                    endStream.on("close", () => {
                        const fileContentHexa = Buffer.concat(buffers);
                        resolve({filePath, fileContentHexa});
                    });
                    endStream.on ("error", reject);

                    body.pipe(endStream);

                }
                else {
                   reject(res.status);
                }
            })
            
        })
        .catch(err => { throw(err) })
        .then(file_ => {        
            return new Promise((resolve, reject) => {
                if(ext.length === 0){
                    ext = detectExtension(file_.fileContentHexa);         
                }
                fs.rename(file_.filePath, `${file_.filePath}${ext}`, (err) => {
                    if(err) return reject(err)

                    file_.filePath += ext;
                    resolve(file_);
                })
            })
        })
        .catch(err => console.log(err));
        
}

module.exports = {
    downloadImage,
    getFileInfos
}

