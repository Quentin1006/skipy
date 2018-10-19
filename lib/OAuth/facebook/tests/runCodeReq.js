const {headless_auth_request } = require("./getFBCodePPTR"); 
const params = process.argv.slice(2);

console.log(params);

const f = (params) => {
    return new Promise((resolve) => {
        const redirect = headless_auth_request(...params);
        resolve(redirect);
    })
}

f(params)
.then(redirect => process.send(redirect|| ""))
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



