const ioredis = require('socket.io-redis');
const node_env = process.env.NODE_ENV
const env =  node_env ? node_env.toLowerCase() : "development";


const redisCreds = {
    development: {
        host: "localhost",
        port: "6379"
    },
    production: {
        host: "localhost",
        port: "6379"
    },

}

const redisConfig = redisCreds[env];
exports.redisAdapter = ioredis(redisConfig);
exports.redisConfig;

