const { authenticateWithFB } = require("../FBauthenticate");


const authInfosWithToken = {
    access_token: "EAAcHDCqVtGgBAHB269IO7swArmPtcgzLf0puQjtD1BSriFDFZAdsMSrnVrZB6RGX04QsG3AOQfCsEZBmuVJZB76liYXWU3VaAWnTYnZAJGEPGOhZBHTCoQMGs0xzv65VKZAE4o6OEiQjEZA54gZCEXfNBq0UwASlDAicxZB3wgk4XBF24hfUBpLdYmpoImqTwPBxNZAJIM32zNzpAZDZD",
    auth_type: "token",
}

const authInfosWithCode = {
    code: "",
    auth_type: "code",
    redirect_uri: "http://localhost:3001/login",
}

authenticateWithFB(authInfosWithToken)
    .then(res => console.log("authenticateWithFB", res))
    .catch(err => console.log("authenticateWithFB err", err));