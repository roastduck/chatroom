/**
 * Log in
 * POST: username, password
 */

module.exports = (function(models) {
    return (function(req, res, next) {
        models.user.passport.authenticate('local', function(err, user, info) {
            if (err) return next(err);
            if (!user) return res.send({ stat: "error", msg: "login failed" });
            req.logIn(user, function(err) { // NOTE: requierd in this mode
                if (err) return next(err);
                return res.send({ stat: "success", msg: "logged in" });
            });
        })(req, res, next);
    });
});

