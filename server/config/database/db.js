const mongoose = require("mongoose");
const dbConfig = require("./db_config");

const connectDB = (database_url) => {
    console.log(database_url);
    if (!database_url) {
        console.error("voud devez fournir un url pour la connexion à la base de données : ", database_url);
        process.exit(1);
    }

    mongoose
        .connect(database_url, dbConfig.options)
        .then(() => {
            console.log(`> MongoDB Connected on : ${database_url}`);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1); // si la base de données ne se lance pas alors on kill l'app
        });
};

module.exports = connectDB;
