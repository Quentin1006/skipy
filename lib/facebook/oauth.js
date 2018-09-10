const { Facebook } = require("fb");
const oauth = require("../../config").oauth.facebook;
const { appFacebookCreds, version } = oauth;
const FB = new Facebook({version});

let appToken;


const request = (path, params) => {
    return new Promise((resolve, reject) => {
        FB.api(path, params, (res) => {
            if(!res || res.error){
                reject(!res ? 'error occurred' : res.error);
            }
            resolve(res);
        })
    })
}


const getUserFBdata = (accessToken, scope="") => {
    const params = {
        access_token: accessToken,
        fields: scope
    }
    return request("me", params);
};


const inspectToken = async (input_token, access_token) => {
    if(!access_token){
        if(appToken && appToken.length > 0){
            access_token = appToken;
            console.log("we already have the token we use it");
        }
        else {
            await getAppAccessToken().then(res => {
                access_token = res.access_token
            });
        }
    }

    const params = {
        input_token,
        access_token
    }

    return request("debug_token", params);
}


const getAccessToken = (params) => {
    return request("oauth/access_token", params);
}


const getAppAccessToken = () => {
    return getAccessToken({
        ...appFacebookCreds,
        grant_type: "client_credentials"
    })
    .then(res => {
        appToken = res.access_token
        return res;
    })
}


const getAccessTokenFromCode = (code, redirect_uri="") => {
    return getAccessToken({
        ...appFacebookCreds,
        redirect_uri,
        code
    })
}


const extendExpiryToken = (existingToken) => {
    return getAccessToken({
        ...appFacebookCreds,
        grant_type: "fb_exchange_token",
        fb_exchange_token: existingToken
    })
}


module.exports = {
    getUserFBdata,
    getAppAccessToken,
    getAccessToken,
    getAccessTokenFromCode,
    extendExpiryToken,
    inspectToken,
    request

}