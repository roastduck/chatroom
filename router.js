/**
 * Exports a constructor for a express.router middleware
 * @param express : express module
 * @param path : path module
 * @param root : root path of this repository
 * @param models : mongoose models
 */

/*
 * /dynamic is directed to /view/dynamic
 * /dynamic/private is that requires logging in
 * /dynamic/public is that doesn't require logging in
 */

/*
 * JSON response follows:
 * { stat: "error", msg: "the message" }
 * or
 * { stat: "success", ... }
 */

module.exports = (function(express, path, root, models) {
    var loadPrivate = (function(p) { return require(path.join(root, "view/dynamic/private", p))(models); });
    var loadPublic = (function(p) { return require(path.join(root, "view/dynamic/public", p))(models); });

    var router = express.Router();
    
    router.all("/dynamic/private/*", function(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.send({ stat: "error", msg: "not logged in" });
    });

    router.post("/dynamic/public/register", loadPublic("register.js"));
    router.post("/dynamic/public/login", loadPublic("login.js"));
    router.get("/dynamic/private/logout", loadPrivate("logout.js"));
    router.get("/dynamic/private/userinfo", loadPrivate("userinfo.js"));

    router.all("*", function(req, res, next) {
        res.sendFile(path.join(root, "view/static/404.html"));
    });

    return router;
});

