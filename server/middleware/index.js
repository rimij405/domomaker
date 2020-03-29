// Require login.
const requiresLogin = (req, res, next) => {
    if(!req.session.account){
        return res.redirect('/');
    }
    return next();
};

// Require logout.
const requiresLogout = (req, res, next) => {
    if (req.session.account) {
        return res.redirect('/maker');
    }
    return next();
};

// Require secure.
const requiresSecure = (req, res, next) => {
    if(req.headers['x-forwarded-proto'] !== 'https'){
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    return next();
};

// Bypass secure.
const bypassSecure = (req, res, next) => {
    next();
};

// Exports.
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if(process.env.NODE_ENV === 'production'){
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassSecure;
}