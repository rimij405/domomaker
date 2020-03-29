// Import libraries.
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');

// Import modules.
const router = require('./router.js');

// Setup the configuration settings.
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const onListen = (err) => {
    if(err) {
        throw err;
    }
    console.log(`Listening on port ${port}`);
}

const db = {
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

// Connect the mongoose database.
mongoose.connect(db.URL, db.options, db.onError);

// Create the application.
const app = express();

// Setup middleware.
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

// Setup the router.
router(app);

// Start and listen to the server.
app.listen(port, onListen);