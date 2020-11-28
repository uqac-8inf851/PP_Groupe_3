const HOST_TEST = "localhost";
const HOST_DEV = "localhost";
const HOST_PROD = "0.0.0.0";

let HOST = null;

if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development") {
    HOST = HOST_DEV;
} else if (process.env.NODE_ENV === "test") {
    HOST = HOST_TEST;
} else if (process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production") {
    HOST = HOST_PROD;
} else {
    console.error("l'environnement est invalide :", process.env.NODE_ENV);
    process.exit(1);
}

module.exports = { HOST, HOST_TEST, HOST_DEV, HOST_PROD };
