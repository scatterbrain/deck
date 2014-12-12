var express = require('express'), 
router = express.Router(),
util = require('util');

module.exports = function(passport) {
    // route for facebook authentication and login
    router.get('/facebook', passport.authenticate('facebook', { scope : 'email' }) );

    // handle the callback after facebook has authenticated the user
    router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect : '/', failureRedirect : '/' } ));

    // route for logging out
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
};

