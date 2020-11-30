module.exports = {
    apps: [
        {
            name: "server",
            script: "./server/server.js",
            instances: 3,
            exec_mode: "cluster",
            increment_var: "PORT",
            env: {
                PORT: 5500,
            },
        },
    ],
};
