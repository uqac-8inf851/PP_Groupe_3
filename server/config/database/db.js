const mongoose = require("mongoose");
const dbConfig = require("./db_config");

const connectDB = () => {
    var db;

    // si on est en environnement de test
    if (process.env.NODE_ENV === "test") {
        db = dbConfig.url + dbConfig.test_database;
    } else {
        db = dbConfig.url + dbConfig.prod_database;
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
