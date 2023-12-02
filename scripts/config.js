module.exports = {
    open: true,
    webpack: {
        entry: {
            boxen: "./source/js/app.js"
        }
    },
    postcss: {
        browsers: "last 2 versions"
    },
    browserUrl: "http://localhost:9000",
    reloadUrl: "http://localhost:9000/local-api/reload/trigger",
};
