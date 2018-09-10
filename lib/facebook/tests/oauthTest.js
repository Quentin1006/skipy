const m = require("../oauth.js");

const userToken = "EAAcHDCqVtGgBAH0TRH9zKoL6us7HFaXBjNMq6FnZCZCXXG3KuZAw0JDVOSj9LtdteZAtiSg7rPB3NucNK131cBzzIHZCuOgoGHjiFqvTIguKn1TG1IbgOT1PTHWmvwongWWez00pmCwsgRBld1muGIWECvAFP3hOxDhr3OTm5ORPDcyqtq3YKjeneSHeLJwDKLmBCpm29qJa9eLFZAHKeeeyWUbTVfR5Kq3YgHI8RWzwZDZD"
const appToken = "";
const scope = "id,name,email,friends";


m.getUserFBdata(userToken, scope)
    .then(res => console.log("getUserFBdata", res))
    .catch(err => console.log("getUserFBdata catch", err))


m.getAppAccessToken()
    .then((res) => console.log("getAppAccessToken", res))
    .catch(err => console.log("getAppAccessToken catch" ,err))
    .then(() => {
        m.inspectToken(userToken)
            .then((res) => console.log("inspectToken", res))
            .catch(err => console.log("inspectToken catch", err))

    })


m.extendExpiryToken(userToken)
    .then((res) => console.log("extendExpiryToken", res))
    .catch(err => console.log("extendExpiryToken catch", err))


/*
m.getAccessTokenFromCode()
    .then(res => console.log(res))
    .catch(err => console.log(err))

*/
    
