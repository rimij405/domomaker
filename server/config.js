if(process.env.NODE_ENV === 'production'){
    const url = require('url');

    console.log(process.env.REDISCLOUD_URL);

    const redisURL = url.parse(process.env.REDISCLOUD_URL);
    const passIndex = 1;
    const redisPass = redisURL.auth.split(':')[passIndex];

    module.exports = {
        REDISCLOUD_URL: redisURL.hostname,
        REDISCLOUD_PORT: redisURL.port,
        REDISCLOUD_PASSWORD: redisPass
    };    
} else {
    module.exports = require('./.secret.js');
}
