const FBoauth = require("../../../../config").oauth.facebook;
const m = require("../FBOauth")(FBoauth);


/**
 * Retrieve user data with his token 
 * 
 */
const testGetUserFBData = (userToken, scope) => {
    return m.getUserFBdata(userToken, scope)
    .then(userData => {
        console.log("getUserFBdata", userData);
        return userData;
    })
    .catch(err => console.log("getUserFBdata catch", err))
}


/** 
 * Get the token for the app
 * Then inspect if its valid (in case we reuse an old one)
 * Should be implemented directly in the appAccessToken fct
 * 
 */
const testGetAppAccessToken = () => {
    return m.getAppAccessToken()
        .then((appToken) => {
            console.log("getAppAccessToken", appToken);
            return appToken;
        })
        .catch(err => console.log("getAppAccessToken catch" ,err))
}

/**
 * verifier la validité du token
 */
const testInspectToken = (userToken) => {
    return m.inspectToken(userToken)
        .then((res) => {
            console.log("inspectToken", res);
            return res;
        })
        .catch(err => console.log("inspectToken catch", err))
}


/**
 * allonger la durée du token
 * 
 * 
 */
const testExtendExpiryToken = (userToken) => {
    return m.extendExpiryToken(userToken)
        .then((res) => {
            console.log("extendExpiryToken", res);
            return res;
        })
        .catch(err => console.log("extendExpiryToken catch", err))
}


/**
 * obtenir le token en ayant le code d'autorisation
 */
const testGetAccessTokenFromCode = (code, redirect_uri) => {
    return m.getAccessTokenFromCode(code, redirect_uri)
        .then(token => {
            console.log("getAccessTokenFromCode", token)
            return token;
        })
        .catch(err => {
            console.log("catch getAccessTokenFromCode", err)
        })
}

const testCheckPermissions = (token) => {
    return m.checkPermissions(token)
        .then(permissions => {
            console.log(permissions);
            return permissions;
        })
        .catch(err => {
            console.log("catch checkPermissions", err);
        })
}

module.exports = {
    testGetAccessTokenFromCode,
    testExtendExpiryToken,
    testInspectToken,
    testGetAppAccessToken,
    testGetUserFBData,
    testCheckPermissions
}