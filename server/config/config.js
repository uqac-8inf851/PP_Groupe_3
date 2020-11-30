const logger = require("./logger/winston");
const dbConfig = require("./database/db_config");

const NODE_ENV_ARRAY = ["development", "production", "test", "heroku"];

// ports
const PORT_PROD = process.env.PORT || 5500;
const PORT_DEV = process.env.PORT || 5500;
const PORT_TEST = process.env.PORT || 5500;
const PORT_HEROKU = process.env.PORT || 80;

// hosts
const HOST_TEST = "localhost";
const HOST_DEV = "localhost";
const HOST_PROD = "localhost";
const HOST_HEROKU = "0.0.0.0";

module.exports = (function () {
    // si l'environnement n'est pas valide, on termine le processus
    if (!NODE_ENV_ARRAY.includes(process.env.NODE_ENV)) {
        logger.error("L'environnement NodeJS executé est invalide : %s", process.env.NODE_ENV);
        process.exit(1);
    }

    const NODE_ENV = process.env.NODE_ENV;

    // définition du port
    let PORT = null;

    if (NODE_ENV === "development") {
        PORT = PORT_DEV;
    } else if (NODE_ENV === "test") {
        PORT = PORT_TEST;
    } else if (NODE_ENV === "production") {
        PORT = PORT_PROD;
    } else if (NODE_ENV === "heroku") {
        PORT = PORT_HEROKU;
    }

    // définition du host
    let HOST = null;

    if (NODE_ENV === "development") {
        HOST = HOST_DEV;
    } else if (NODE_ENV === "test") {
        HOST = HOST_TEST;
    } else if (NODE_ENV === "production") {
        HOST = HOST_PROD;
    } else if (NODE_ENV === "heroku") {
        HOST = HOST_HEROKU;
    }

    // définition de l'url de connexion à la DB
    let DATABASE_URL = null;

    if (NODE_ENV === "development") {
        DATABASE_URL = dbConfig.dev_database_url;
    } else if (NODE_ENV === "test") {
        DATABASE_URL = dbConfig.test_database_url;
    } else if (NODE_ENV === "production" || NODE_ENV === "heroku") {
        DATABASE_URL = dbConfig.prod_database_url;
    }

    return {
        NODE_ENV,
        PORT,
        HOST,
        DATABASE_URL,
    };
})();
