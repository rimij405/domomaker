const url = require('url');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'production') {
  console.log(process.env.REDISCLOUD_URL);

  const redisURL = url.parse(process.env.REDISCLOUD_URL);
  const passIndex = 1;
  const redisPass = redisURL.auth.split(':')[passIndex];

  // Export production configuration settings.
  module.exports = {
    REDISCLOUD_URL: redisURL.hostname,
    REDISCLOUD_PORT: redisURL.port,
    REDISCLOUD_PASSWORD: redisPass,
  };
} else {
  // Read configuration file if this becomes an issue.
  dotenv.config({ path: 'server/.env' });

  // Export secrets from dotenv.
  module.exports = {
    REDISCLOUD_URL: process.env.REDISCLOUD_URL,
    REDISCLOUD_PORT: process.env.REDISCLOUD_PORT,
    REDISCLOUD_PASSWORD: process.env.REDISCLOUD_PASSWORD,
  };
}
