const path = require("path");
const winston = require("winston");
const { Loggly } = require("winston-loggly-bulk");

const LOGS_FOLDER = "logs";
const TESTS_LOGS_FOLDER = "tests";
let LOGS_PATH_FOLDER = path.join(process.cwd(), LOGS_FOLDER);

// en test, on utilise les logs dans le dossier "logs/tests/**"
if (process.env.NODE_ENV === "test") {
    LOGS_PATH_FOLDER = path.join(LOGS_PATH_FOLDER, TESTS_LOGS_FOLDER);
}

function generateTransportLogLevelOptions(level, filename) {
    return {
        level,
        filename: path.join(LOGS_PATH_FOLDER, filename),
        maxsize: 10000000, // ~10MB
        maxFiles: 10,
        format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), winston.format.json()),
    };
}

const logger = new winston.createLogger({
    transports: [
        new winston.transports.File(generateTransportLogLevelOptions("error", "error.log")),
        new winston.transports.File(generateTransportLogLevelOptions("info", "infos.log")),
        new winston.transports.File(generateTransportLogLevelOptions("verbose", "combined.log")),
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// en production on envoie les logs vers loggly
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "heroku") {
    logger.add(
        new Loggly({
            level: "verbose",
            token: "f9010f48-f2e3-4cdb-a8c4-6bd245a66fb1",
            subdomain: "dicosaedrique",
            tags: ["PP_Pratique_3"],
            format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), winston.format.json()),
        })
    );
}

// en développement utilise en plus la console
if (process.env.NODE_ENV === "development") {
    logger.add(
        new winston.transports.Console({
            level: "silly",
            handleExceptions: true,
            json: false,
            colorize: true,
            format: winston.format.combine(
                winston.format((info) => {
                    // filtre les log HTTP (pour la console)
                    if (info.level === "http") return false;
                    return info;
                })(),
                winston.format.splat(),
                winston.format.simple()
            ),
        })
    );
}

// le stream à utiliser pour morgan
logger.morganStream = {
    write: function (message) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.http(message);
    },
};

module.exports = logger;
