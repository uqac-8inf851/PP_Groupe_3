// propriété de configuration de la base de données

module.exports = {
    url: "mongodb://localhost:27017/",
    prod_database: "PPratiqueGenie",
    test_database: "PPratiqueGenie_Test",
    options: {
        useNewUrlParser: true,
        useCreateIndex: true, // unique id so dont duplicate
        useUnifiedTopology: true,
        useFindAndModify: false,
        autoIndex: true,
        poolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
    },
};