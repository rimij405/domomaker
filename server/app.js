// Import libraries.
const path = require('path');
const csrf = require('csurf');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const session = require('express-session');
const redis = require('redis');
const RedisStore  = require('connect-redis')(session);

// Import modules.
const router = require('./router.js');
const config = require('./config.js');

//////////////////
// CONFIGURATION

// Setup the server port.
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Setup the MongoDB settings for mongoose.
const mongodb = {
    // Database connection URI.
    URL: process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker',
    // Mongoose options.
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    // Mongoose error handler.
    onError: (err) => {
        if(err) {
            console.error("Could not connect to database.");
            throw err;
        }
    }
};

// Setup the Redis client.
const redisClient = redis.createClient({
    host: `${config.REDISCLOUD_URL}`,
    port: `${config.REDISCLOUD_PORT}`,
    password: `${config.REDISCLOUD_PASSWORD}`
});

// Setup the Redis store.
const redisStore = new RedisStore({ client: redisClient });

// Connect the mongoose database.
mongoose.connect(mongodb.URL, mongodb.options, mongodb.onError);

// Create the application.
const app = express();

// Setup middleware.
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    key: 'sessionid',
    store: redisStore,
    secret: 'Domo Arigato',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true
    }
}));
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

// CSRF should come after cookie parser and session, but before the router.
app.use(csrf());
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    }

    console.error('Missing CSRF token.');
    return false;
});

// Setup the router.
router(app);

// Create callback.
const onListen = (err) => {
    if(err) {
        throw err;
    }
    console.log(`Listening on port ${port}`);
}

// Start and listen to the server.
app.listen(port, onListen);