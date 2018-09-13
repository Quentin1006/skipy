const FBoauth = require("../../../../config").oauth.facebook;
const m = require("../FBOauth.js")(FBoauth);


const userToken = "EAAcHDCqVtGgBAKVk4vPkKc5hG8hjhX8SNfYxZATLAE5YYC8sahcP4nNZCUZB94SJcmUZBZAWCJK7vorXQDSE4pTkSmfLi53RugYtWjkZCyZCaSPAJYtPnlkqY28ccXgXsyquhkZCi4aBaTbhisNrNI30aXOzPFnqAVJx3APhNZAZCzmKLU9E0cDJtR91ZCADgpDkqxQVZBcZA7kjBWPZCowA0jHB5karkcvcLtXq3rb8WBxO9tIwZDZD"
const appToken = "";
const scope = "id,name,email,friends";
const code = "AQDxLLrC_qvbjOxIw071-fWF2t2tX1ydgsMaaeuMgXgrv1BI6X91TynWKYgtXDuDuMLp9qV2Cl695Fu0Z_YY-4YWVOVLO_CPnpwi0KMieVtsZKUGZsHUfGhdk8zN567ZJitGP4ff576PHfjzTrzLPNDGqpM4rXWI0Cz8jQgjx70OTm_1HQpicpTjo-xbCgNDGNvN0-ethoICJUf8brDnMu_YAh1Pc4H4fbgTJQ-lQZ8Q5wFWKfuG6kpb9yx06hLakYpcBHiTci-G_1C4W1qLa6KcZz-4GjTC6UYFE7x0RNnhbMs-TksRjRFXEN8bbtW4-J4#_=_"


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
    .then(res => {
        console.log("getAccessTokenFromCode", res)
    })
    .catch(err => {
        console.log("catch getAccessTokenFromCode", err)
    })


    
