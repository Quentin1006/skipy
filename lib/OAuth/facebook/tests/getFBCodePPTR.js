const puppeteer = require('puppeteer');
const {parse} = require("url");

const emailSelector = "#email"
const pwdSelector = "#pass";
const loginBtnSelector = "#loginbutton";
const confirmPermissionsBtn = "#u_0_v button[name='__CONFIRM__']";
const hostFB = 'www.facebook.com';

const getCode = (url) => parse(url, true).query.code;
let auth_code = "";

exports.headless_request = async(uri, email, pwd) => {
    const browser = await puppeteer.launch({
        // headless: false, 
        // devtools: true
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

    const target_url_parsed = parse(page.target().url(), true);
    const { pathname, host } = target_url_parsed;

    // Il s'agit d'une premiere connection, on doit accepter les permissions
    // on reste sur la mm page et on doit accepter les permissions
    if(host === hostFB && uri.includes(pathname)){
        console.log("needs permissions");
        await page.waitFor(confirmPermissionsBtn)
        await Promise.all([
            page.waitForNavigation(),
            page.click(confirmPermissionsBtn),
        ]);
    }

    auth_code = getCode(page.target().url());

    await browser.close();

    return auth_code;

}

