const FBoauth = require("../../../../config").oauth.facebook;
const m = require("../FBOauth.js")(FBoauth);

const userToken = "EAAcHDCqVtGgBAEJ6acmQThYg3TaZAZA2jSzGj12xnvanJjuAmBlZBahp5ldAugYhrH7WwxtLokReR3DvvSAeJV7NUmPeP4o2ZBacZAnlibEDFqesBMtKidZAasemJjsiLV1OQnVHxdvTt7WFswfIWOZAy5XZBNtXo3LZCrMRgHdw48wa3i1Vfn4bWqy7jNVljnwES2BUiYM9vz3dWoKMZADv5n8eTGQYJcsv0gT1R7xceZByQZDZD"
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


    
