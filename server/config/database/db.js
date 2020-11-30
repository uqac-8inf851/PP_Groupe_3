const mongoose = require("mongoose");
const dbConfig = require("./db_config");
const logger = require("../logger/winston");

const connectDB = (database_url) => {
    if (!database_url) {
        logger.error(
            'Vous devez fournir un url pour la connexion à la base de données (url fourni "%s") -> server stopped',
            database_url
        );
        process.exit(1);
    }

    mongoose
        .connect(database_url, dbConfig.options)
        .then(() => {
            console.log(`> MongoDB Connected on : ${database_url}`);
            logger.info("> MongoDB Connected on : %s", database_url);
        })
        .catch((err) => {
            logger.error(
                "Une erreur est survenue lors de la connexion à la base de données -> server stopped. Error : %O",
                err
            );
            process.exit(1); // si la base de données ne se lance pas alors on kill l'app
        });
};

module.exports = connectDB;
