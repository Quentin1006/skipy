// ici installer l'adapter

const node_env = process.env.NODE_ENV
const env =  node_env ? node_env.toLowerCase() : "development";

const useRedis = false;
const { redisAdapter } = require("./redis");

const adapter = useRedis ? redisAdapter : null;

module.exports = {
    serveClient: false,
    transports: ["websocket", "polling"],
    pingTimeout: env === "development" ? 20000 : 2000,
}