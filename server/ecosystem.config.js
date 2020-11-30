module.exports = {
    apps: [
        {
            name: "myapp",
            script: "./server.js",
            instances: 3,
            exec_mode: "cluster",
            watch: true,
            increment_var: "PORT",
            env: {
                PORT: 5500,
                NODE_ENV: "development",
            },
        },
    ],
};
