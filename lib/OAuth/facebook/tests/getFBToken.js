const getFBTokenWithPPTR = require("./getFBTokenWithPPTR"); 
const params = process.argv.slice(2);

const f = (params) => {
    return new Promise((resolve) => {
        const token = getFBTokenWithPPTR(...params);
        resolve(token);
    })
}

f(params)
.then(token => process.send(token|| ""))
.catch(err => console.log(err))


process.on("exit", (code) => {
    console.log("closing", code);
})

process.on("uncaughtException", err => {
    console.log("uncaughtException", err);
})

process.on("unhandledRejection", (p, reason) => {
    console.log("unhandledRejection", p, reason);
})



