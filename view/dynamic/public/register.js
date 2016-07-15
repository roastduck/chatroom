/**
 * Register
 * POST: username, password
 */

module.exports = (function(models) {
    return (function(req, res, next) {
        models.user.findOne({
            name: req.body.username
        }, {}, function(err, user) {
            if (err) return next(err);
            if (user) return res.send({ stat: "error", msg: "username already exists" });
            models.user.create({
                name: req.body.username,
                password: req.body.password
            }, function(err, user, numAffected) {
                if (err) return next(err);
                req.logIn(user, function(err) {
                    if (err) return next(err);
                    return res.send({ stat: "success", msg: "registered and logged in" });
                });
            });
        });
    });
});

