module.exports = {
    apps: [
        {
            name: "server",
            script: "./server/server.js",
            exp_backoff_restart_delay: 100,
        },
    ],
};
