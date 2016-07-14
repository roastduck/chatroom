/*
 * User info
 */

module.exports = (function(models) {
    return (function(req, res, next) {
        res.send({
            stat: "success",
            name: req.user.name
        });
    });
});
