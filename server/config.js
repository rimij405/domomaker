if(process.env.NODE_ENV === 'production'){
    module.exports = {
        REDISCLOUD_URL: process.env.REDISCLOUD_URL,
        REDISCLOUD_PORT: process.env.REDISCLOUD_PORT,
        REDISCLOUD_PASSWORD: process.env.REDISCLOUD_PASSWORD,
    };
} else {
    module.exports = require('./.secret.js');
}
