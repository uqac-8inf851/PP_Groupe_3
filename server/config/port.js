const PORT_PROD = process.env.PORT || 80;
const PORT_DEV = 5500;
const PORT_TEST = 5500;

let PORT = null;

if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development") {
    PORT = PORT_DEV;
} else if (process.env.NODE_ENV === "test") {
    PORT = PORT_TEST;
} else if (process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production") {
    PORT = PORT_PROD;
} else {
    console.error("l'environnement est invalide :", process.env.NODE_ENV);
    process.exit(1);
}

module.exports = { PORT, PORT_TEST, PORT_DEV, PORT_PROD };
