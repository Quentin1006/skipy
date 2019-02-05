const fetch = require("cross-fetch");

const testRoute = ({
    url, 
    method="get",
    headers={},
    body={},
    respCb,
    errCb = (err => console.log("err:", err))

}) => {
    const fetchOpts = {
        method,
        headers
    }

    if(method.toLowerCase() === "post"){
        fetchOpts.body = serializeParams(body);
        fetchOpts.headers['Accept'] = 'application/json, text/plain, application/x-www-form-urlencoded';
        fetchOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    fetch(url, fetchOpts)
        .then(respCb)
        .catch(errCb)
        .then(resp => console.log(resp));
}


const testRouteStatus = ({
    url, 
    method="get",
    headers={},
    body={},
    respCb = (resp => resp.status)
}) => {
    return testRoute({
        url, 
        method,
        headers,
        body,
        respCb
    })
}


const testRouteJson = ({
    url, 
    method="get",
    headers={},
    body={},
    respCb = (resp => resp.json())
}) => {
    return testRoute({
        url, 
        method,
        headers,
        body,
        respCb
    })
}

const serializeParams = (params) => { 
    return params 
        ? Object.keys(params).map((key) => (
            [key, params[key]].map(encodeURIComponent).join("=")
        )).join("&") 
        : '' 
}


module.exports = {
    testRouteJson,
    testRouteStatus
}