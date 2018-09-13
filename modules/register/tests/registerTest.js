const { register } = require("../");


const authInfosWithToken = {
    access_token: "EAAcHDCqVtGgBAHB269IO7swArmPtcgzLf0puQjtD1BSriFDFZAdsMSrnVrZB6RGX04QsG3AOQfCsEZBmuVJZB76liYXWU3VaAWnTYnZAJGEPGOhZBHTCoQMGs0xzv65VKZAE4o6OEiQjEZA54gZCEXfNBq0UwASlDAicxZB3wgk4XBF24hfUBpLdYmpoImqTwPBxNZAJIM32zNzpAZDZD",
    auth_type: "token",
    provider: "facebook"
}

const authInfosWithCode = {
    code: "AQAjOZLVxpkgcS9w0X9Ht9Q3OWNE0oe78kem0dJNmUJ5zgM2FAJs6_leUdy8XwhoL5of5xEQzCjSGnFDM0PtrY1Ok05tv7QZ-PoHGx4PLejY42JBiatTRqst8YpXyrW2j9N_a8mugQoFnIJIedGE59kgG0_waQaS4MYemVcYn8sSw530qD5Ec4HoSomvdj1yGKfwDKJNNmCkV0lAoW5NiiF2sKfAx3hG6N-2HtvoWBqlL52wiLI_vFAdXE-PyJwcfSU9CYOVZ6AXB5xR2FrHCXSe3cOoLsSmk1v8x3Sg33Dj-gj40S5pdRKdEBWcwrVEGM0#_=_",
    auth_type: "code",
    redirect_uri: "http://localhost:3001/login",
    provider: "facebook"
}

register(authInfosWithToken)
    .then(res => console.log("register", res))
    .catch(err => console.log("register err", err));