// EXACTLY THE SAME AS THE SCRIPT TO GET AN AUTH CODE
// SHOULD MERGE INTO ONE FILE


const puppeteer = require('puppeteer');
const qs = require("querystring");
const debug = require("debug")("getFBCode:PPTR")

const emailSelector = "#email"
const pwdSelector = "#pass";
const loginBtnSelector = "#loginbutton";
const confirmPermissionsBtn = "#u_0_v button[name='__CONFIRM__']";
const hostFB = 'www.facebook.com';

const getKey = (url, key="access_token") => {
    // On autorise que deux parties dans notre split au cas 
    // ou il y aurait un ? et un # dans une meme url
    // on ne prendrait pas en compte le hash
    const dataUrl = qs.parse((url.split(/[#?]/, 2)[1]));
    return dataUrl[key];
}

let key = "";

exports.headless_auth_request = async(uri, email, pwd, redirect_uri) => {
    const browser = await puppeteer.launch({
        headless: false, 
        devtools: true
    });
    const page = await browser.newPage();
    page.on("error", (err) => {
        console.log(err);
        process.exit(err);
    })


    await page.goto(uri);

    // desactiver les notifications pouvant bloquer le processus
    const context = browser.defaultBrowserContext();
    // important to specify the https:// part
    await context.overridePermissions(`https://${hostFB}`, ['notifications']);


    await page.type(emailSelector, email)
    await page.type(pwdSelector, pwd)

    // Click on login button then wait for response page to load 
    const [response] = await Promise.all([
        page.waitForNavigation(),
        page.click(loginBtnSelector),
    ]);

    const target_url = page.target().url()

    
    debug("target_url: ",target_url);
    debug("redirect_uri: ",redirect_uri);

    // Il s'agit d'une premiere connection, on doit accepter les permissions
    // on reste sur la mm page et on doit accepter les permissions
    if(!target_url.includes(redirect_uri)){
        console.log("We need to add the permissions");
        await page.waitFor(confirmPermissionsBtn)
        await Promise.all([
            page.waitForNavigation(),
            page.click(confirmPermissionsBtn),
        ]);
    }
    debug(page.target().url());
    key = getKey(page.target().url());

    await browser.close();

    return key;

}
