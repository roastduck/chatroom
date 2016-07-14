/**
 * Register
 * POST: username, password
 */

module.exports = (function(models) {
    return (function(req, res, next) {
        models.user.create({
            name: req.body.username,
            password: req.body.password
        }, function(err, user, numAffected) {
            if (err) next(err);
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.send({ stat: "success", msg: "registered and logged in" });
            });
        });
    });
});
