const env = process.env;
const path = require("path");

module.exports = {
    adminKey :env.ADMIN_KEY,
    mailer: {
        type: "OAuth2",
        user: env.QUENTIN_EMAIL,
        clientId: env.MAILER_CLIENT_ID,
        clientSecret: env.MAILER_CLIENT_SECRET,
        refreshToken: env.MAILER_REFRESH_TOKEN,
        accessToken: env.MAILER_ACCESS_TOKEN
        // If generated from the playground its important to add the client id and client secret in the settings

    },
    oauth: {
        facebook: {
            client_id:env.OAUTH_FB_CLIENT_ID,
            client_secret: env.OAUTH_FB_CLIENT_SECRET,
        }
    },
    creds: {
        facebook: {
            user_mail: env.GONTRAN_EMAIL,
            user_pwd: env.CREDS_FB_USER_PWD
        }
    },

    gontran : {
        id:  env.GONTRAN_ID,
        email: env.GONTRAN_EMAIL,
        profilepic: env.GONTRAN_PROFILE_PIC
    },
    quentin: {
        id: env.QUENTIN_ID,
        email: env.QUENTIN_EMAIL,
        profilepic: env.QUENTIN_PROFILE_PIC
    },
    sessionSecret: env.SESSION_SECRET,
    ppictureDir: path.resolve(__dirname, "../upload/ppicture"),
    pathToData: path.resolve(__dirname, "../db/data.json"),
    corsWhitelist: env.CORS_WHITELIST,

    httpsCertKey: env.CERT_SERVER_KEY,
    httpsCert: env.CERT_SERVER

}