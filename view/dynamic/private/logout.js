/**
 * Log out
 */

module.exports = (function(models) {
    return (function(req, res, next) {
        req.logOut();
        res.send({ stat: "success", msg: "logged out" });
    });
});
