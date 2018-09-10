const m = require("../oauth.js");

const userToken = "EAAcHDCqVtGgBAH0TRH9zKoL6us7HFaXBjNMq6FnZCZCXXG3KuZAw0JDVOSj9LtdteZAtiSg7rPB3NucNK131cBzzIHZCuOgoGHjiFqvTIguKn1TG1IbgOT1PTHWmvwongWWez00pmCwsgRBld1muGIWECvAFP3hOxDhr3OTm5ORPDcyqtq3YKjeneSHeLJwDKLmBCpm29qJa9eLFZAHKeeeyWUbTVfR5Kq3YgHI8RWzwZDZD"
const appToken = "";
const scope = "id,name,email,friends";
const code = "AQBbGSaoPBtzfqSEwubxuufwGv-SX-_nk-s2MUdWEYtNQnQtZTEoL8fWQC6HG8-SvjC91PpCEcuTdTi6iBRoKOWZvECyy9zTn5kpa_paVVDloEMIZEyEytHHjjkhLcmJdqcM9hMJmFnpGVhPrua0A-yjkDCRdtIdC6zDrpz6Cf3yfb9g7g7ZXkniSQLuC1k2ef7NnmHSusGb1ikSSwA07qHLu0kPU7JEHx43dwaY4xq_Iem85SVQ0kzgn9Wu9RHjxu14yCsvA7noKZu4K-2BnunWHPD1-q91Pu__rFA5DTMoC7puozzNlzHWJ_gfUO8uk0A#_=_"


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



m.getAccessTokenFromCode(code, "http://localhost:3000/login")
    .then(res => console.log("getAccessTokenFromCode", res))
    .catch(err => console.log("catch getAccessTokenFromCode", err))


    
