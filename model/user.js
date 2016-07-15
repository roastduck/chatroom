/**
 * Exports a constructor for a mongoose model
 * @param mongoose : a mongoose instance
 * @param bcrypt : a bcrypt instance
 * @param passport : a passport instance
 * @param passportLocal : a passport-local instance
 * @config : a config object
 */

function encrypt(bcrypt, config) {
    return (function(password) {
        return bcrypt.hashSync(password, config.bcryptRounds); // NOTE: can this be async?
    });
}

function verifyPassword(bcrypt) {
    /**
     * verify password for this user
     * @param callback : fn(err, isMatched)
     */
    return (function(plain, callback) {
        return bcrypt.compare(plain, this.password, callback);
    });
}

function verifyUsernamePassword() {
    /**
     * verify password for a given user
     * @param done : fn(err, username or false)
     */
    return (function(username, password, done) {
        this.findOne({ name: username }, function(err, user) {
            if (err) return done(err);
            if (!user) return done(null, false);
            user.verifyPassword(password, function(err, matched) {
                if (err) return done(err);
                return done(null, matched ? user : false);
            });
        });
    });
}

function setUpPassport(passport, passportLocal, model) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        model.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // NOTE: default field name: username, password
    // NOTE: directly passing a method would change `this`
    passport.use(new passportLocal.Strategy({}, function(username, password, done) {
        model.verifyUsernamePassword(username, password, done);
    }));
}

module.exports = (function(mongoose, bcrypt, passport, passportLocal, config) {
    var schema = new mongoose.Schema({
        name: { type: String, required: true, unique: true },
        password: { type: String, required: true, set: encrypt(bcrypt, config) }
    });
    schema.method({
        verifyPassword: verifyPassword(bcrypt)
    });
    schema.static({
        verifyUsernamePassword: verifyUsernamePassword(),
        passport: passport
    });

    var model = mongoose.connection.model("user", schema);

    setUpPassport(passport, passportLocal, model);
    return model;
});

