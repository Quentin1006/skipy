const { Facebook } = require("fb");

module.exports = (oauth) => {

    const { appFacebookCreds, version, scope } = oauth;
    const defaultScope = scope.default;

    const FB = new Facebook({version});
    let appToken;

    
    /**
     * @param  {string} path Le chemin relative vers le serveur oauth FB
     * @param  {object} params Les paramètres à inclure a la requète
     *                          pex: access_token, fields, code...
     * @returns {Promise} return the resp of FB server
     */
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
    
    
    /**
     * Retrieve user fb data accorging to the permission he gave when generating the token
     * @param  {token} accessToken
     * @param  {string} scope=defaultScope Le scope des data pour lesquelles on demande l'auth
     * @returns {Promise} The response of FB server as a promise
     */
    const getUserFBdata = (accessToken, scope=defaultScope) => {
        const params = {
            access_token: accessToken,
            fields: scope
        }
        return request("me", params);
    };

    /**
     * @param  {token} input_token Le token à inspecter
     * @param  {token} access_token  Le token d’accès d’une app 
     * ou le token d’accès pour un dév de l’app.
     * appToken est une variable globable dans ce module, 
     * si elle a déja été calculée, on la conserve 
     * 
     * @returns {Promise} response of FB server
     */
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

    /**
     * fonction générique pour obtenir un token
     * est utilisée dans @getAppAccessToken et @getAccessTokenFromCode et @extendExpiryToken
     * @param  {object} params
     * @returns {Promise} return also the response from the FB server
     */
    const getAccessToken = (params) => {
        return request("oauth/access_token", params);
    }

    /**
     * @returns return the appToken in promise form
     */
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

    /**
     * Function used in case of full authorization flow
     * @param  {authorization_code} code
     * @param  {uri} redirect_uri=""
     */
    const getAccessTokenFromCode = (code, redirect_uri="") => {
        return getAccessToken({
            ...appFacebookCreds,
            redirect_uri,
            code
        })
    }

    /**
     * Echanger un token de courte durée pour un token de longue durée
     * Les token de courte durée sont émis en général pour 2h
     * L'échange permet d'obtenir un token pour une durée de 60 jours
     * La durée de vie de ce token peut etre renouvelé une fois par jour 
     * lors d'une connection. voir le lien ci-dessus pour plus d'infos
     * https://developers.facebook.com/docs/facebook-login/access-tokens/refreshing
     * @param  {token} existingToken
     */
    const extendExpiryToken = (existingToken) => {
        return getAccessToken({
            ...appFacebookCreds,
            grant_type: "fb_exchange_token",
            fb_exchange_token: existingToken
        })
    }

    /**
     * Permet de voir les permissions que l'user a accordé à l'application
     * @param {fb_user_id} user_id 
     * @param {token} user_token 
     */
    const checkPermissions = (user_id, user_token) => {
        return request(`${user_id}/permissions`, {
            access_token: user_token
        })
    }

    return {
        getUserFBdata,
        getAppAccessToken,
        getAccessToken,
        getAccessTokenFromCode,
        extendExpiryToken,
        inspectToken,
        checkPermissions,
        request
    }

}