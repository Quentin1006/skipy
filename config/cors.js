const corsWhitelist = ['https://localhost:3000'];

module.exports = {
    origin: corsWhitelist.join(','),
    credentials: true,
    maxAge: 86400,
    optionsSuccessStatus: 200
}