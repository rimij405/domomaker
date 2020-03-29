// Import modules.
const models = require('../models');

// Create controller for the Account.
const Account = models.Account;

///////////
// ACTIONS 

// Render the login page.
const loginPage = (req, res) => {
    res.render('login', { csrfToken: req.csrfToken() });
};

// Log in the user.
const login = (req, res) => {

    // Error check.
    if (!req.body.username || !req.body.pass){
        return res.status(400).json({ error: 'RAWR! All fields are required.' });
    }

    // Cast values to string to cover up security flaws.
    const body = {
        username: `${req.body.username}`,
        pass: `${req.body.pass}`,
    }

    // Authenticate user callback.
    const authenticateUser = (err, account) => {
        if(err || !account){
            return res.status(401).json({ error: 'Wrong username or password' });
        }

        // Store session information.
        req.session.account = Account.AccountModel.toAPI(account);

        return res.json({ redirect: '/maker' });
    };

    // Authenticate the user.
    return Account.AccountModel.authenticate(body.username, body.pass, authenticateUser);
};

// Render the signup page.
const signupPage = (req, res) => {
    res.render('signup', { csrfToken: req.csrfToken() });
};

// Sign user up.
const signup = (req, res) => {
    
    // Error check.
    if (!req.body.username || !req.body.pass || !req.body.pass2){
        return res.status(400).json({ error: 'RAWR! All fields are required.' });
    }

    // Cast values to string to cover up security flaws.
    const body = {
        username: `${req.body.username}`,
        pass: `${req.body.pass}`,
        pass2: `${req.body.pass2}`,
    }

    if (body.pass !== body.pass2){
        return res.status(400).json({ error: 'RAWR! Passwords do not match.' });
    }

    // Save password callback.
    const savePassword = (salt, hash) => {

        // Prepare account data.
        const accountData = {
            username: body.username,
            salt,
            password: hash
        };

        // Create new account instance.
        const accountInstance = new Account.AccountModel(accountData);

        // On successful save. (Explicit return)
        const onSuccess = () => { 
            req.session.account = Account.AccountModel.toAPI(accountInstance);
            return res.json({ redirect: '/maker' });
        }

        // On error during save. (Explicit returns)
        const onError = (err) => {
            console.error(err);

            // Error from MongoDB.
            if(err.code === 11000) {
                return res.status(400).json({ error: 'Username already in use.' });
            }

            // Unknown error.
            return res.status(400).json({ error: 'An error occured' });
        };

        // Promise will reject/resolve account accordingly.
        accountInstance.save().then(onSuccess).catch(onError);
    };

    // Generate and save the hash.
    return Account.AccountModel.generateHash(body.pass, savePassword);
};

// Logout.
const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

module.exports = {
    loginPage,
    login,
    signupPage,
    signup,
    logout
}