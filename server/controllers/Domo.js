// Import modules.
const models = require('../models');
const Domo = models.Domo;

///////////
// ACTIONS

// Request a Domo page.
const makerPage = (req, res) => {
    Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'An error occured.' });
        }
        res.render('app', { csrfToken: req.csrfToken(), domos: docs });
    });
};

// Make a Domo.
const make = (req, res) => {

    // Error check.
    if (!req.body.name || !req.body.age){
        return res.status(400).json({ error: 'RAWR! All fields are required.' });
    }

    // Cast values to string to cover up security flaws.
    const domoData = {
        name: `${req.body.name}`,
        age: `${req.body.age}`,
        owner: `${req.session.account._id}`,
    }

    // Create new Domo instance.
    const domoInstance = new Domo.DomoModel(domoData);

    // On successful save. (Implicit return)
    const onSuccess = () => res.json({ redirect: '/maker' });
    
    // On error during save. (Explicit returns)
    const onError = (err) => {
        console.error(err);

        // Error from MongoDB.
        if(err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists.' });
        }

        // Unknown error.
        return res.status(400).json({ error: 'An error occured' });
    };

    // Promise will reject/resolve account accordingly. Return it.
    return domoInstance.save().then(onSuccess).catch(onError);
};

// Export.
module.exports = {
    makerPage,
    make
};