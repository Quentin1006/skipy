require("app-module-path").addPath(process.cwd());

const creds = require("config").oauth.facebook
const { registerWithFB, use } = require("../FBregister")(creds);
const db = require("db");

const authInfosWithToken = {
    access_token: "EAAcHDCqVtGgBABDMZC55CUsNihJOFUyP8YEkdIZA1xkmsmoCQFakSck9r02VIw8BZCVDCHkX6C1Kgtl8GuVxKnUuVUoMpZCwGu7Pr7vwyLy4qVEYYvxZAQYvoZCq1bT4XvpWfT9uZClLw9ncVK4ANXhpL4PsWhtNgvFwXCDZAw6y4w2LScQGqZAjYqzb1BpGwfuUbGdVr2IYLo2oAEAoAUAjNEwy46Q4uYEKtfwI2d7rkLgZDZD",
    auth_type: "token",
    provider: "facebook"
}

const authInfosWithCode = {
    code: "AQAgBzI7Iw0ttg3WZKx8iVWS2_aFdEZ0I2i1DOOhRBMxwqkJhjSsPyo7YWTSYSFbqEhf8mKSbNIu22i5BzJ8SRpPDku8bIvocwshJyLF8yf_aZ1e5rcj0c5aSLLbNovnhUl494AXhdNsAFFpg9EIufaNClbAgYQwUY8Mca0JZ0r00JgjbBk7GlAdXvP-GvWy_07A6dlgFprLnPc96b-5pHkC8ao03r0FJArGKZ41Pi6lJ9wRqLwyt0zBwwVvTIJ2wU4cLZwQ4CwURspE2kD5H68SAYFN6RCY-zSW6mENLK_8e5ybX3BnaKwj3XJejGLOiy0#_=_",
    auth_type: "code",
    redirect_uri: "http://localhost:3001/login",
    provider: "facebook"
}

use("checkIfUserExists", db.checkIfUserExists);
use("addUser", db.addUser);


registerWithFB(authInfosWithCode)
    .then(res =>{
        console.log("registerWithFB", res)
    })
    .catch(err => {
        console.log("registerWithFB err", err)
    });