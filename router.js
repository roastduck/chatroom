/**
 *  Exports a constructor for a express.router middleware
 *  @param express : express module
 *  @param path : path module
 *  @param root : root path of this repository
 */

module.exports = (function(express, path, root) {
    router = express.Router();
    
    router.all("*", function(req, res, next) {
        res.sendFile(path.join(root, "view/404.html"));
    });

    return router;
});
