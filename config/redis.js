const ioredis = require('socket.io-redis');
const env = process.env
const node_env =  env.NODE_ENV ? env.NODE_ENV.toLowerCase() : "development";


const redisCreds = {
    development: {
        host: env.REDIS_DOMAIN,
        port: env.REDIS_PORT
    },
    production: {
        host: env.REDIS_DOMAIN,
        port: env.REDIS_PORT
    },

}

const redisConfig = redisCreds[node_env];
exports.redisAdapter = ioredis(redisConfig);
exports.redisConfig;

