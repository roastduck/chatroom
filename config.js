module.exports = {

    /// logLevel can be "combined", "common", "dev", "short" or "tiny". Please refer to morgan's document
    logLevel: "dev",

    /// log directory
    logDir: "/log",

    /// db url to MongoDB
    dbUrl: "mongodb://localhost/chatroom",

    /// used to sign cookies for session
    sessionSecret: "some session salt",

    /// rounds used by BCrypt to encrypt passwords
    bcryptRounds: 8,

    /// Port to serve the web
    port: 8080
};

