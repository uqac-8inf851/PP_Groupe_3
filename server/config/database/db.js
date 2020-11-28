const mongoose = require("mongoose");
const dbConfig = require("./db_config");

const connectDB = () => {
    let db;

    if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development") {
        db = dbConfig.dev_database_url;
    } else if (process.env.NODE_ENV === "test") {
        db = dbConfig.test_database_url;
    } else if (process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production") {
        db = dbConfig.prod_database_url;
    } else {
        console.error("l'environnement est invalide :", process.env.NODE_ENV);
        process.exit(1);
    }

    mongoose
        .connect(db, dbConfig.options)
        .then(() => {
            console.log(`> MongoDB Connected on : ${db}`);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1); // si la base de données ne se lance pas alors on kill l'app
        });
};

module.exports = connectDB;
