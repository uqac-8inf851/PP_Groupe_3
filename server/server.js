/* Modules */
const express = require("express");
const bodyParser = require("body-parser");
const sessions = require("client-sessions");

const connectDB = require("./config/database/db");

// selection du port (prod / dev)
const PORT_PROD = process.env.PORT || 80;
const PORT_DEV = 5500;
const PORT_TEST = 5500;
let PORT = null;

if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development") {
    // en cas de dev
    PORT = PORT_DEV;
} else if (process.env.NODE_ENV === "test") {
    // en cas de test
    PORT = PORT_TEST;
} else if (process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production") {
    // en cas de production
    PORT = PORT_PROD;
} else {
    // par défaut
    PORT = PORT_DEV;
}

// création de l'app
const app = express();

// connexion à la BD
connectDB();

// Initialisation des middlewares
app.use(express.static("./Public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    sessions({
        cookieName: "session",
        secret: "sjwf0MKLBVsTMMzVO4dI0FFEyO3JZ5DAluG28Irj8n29Sloir6lxDpTVKiyamDbkVK8rkEzKQPAjStI5HARKF6iw6ZESn9p942KR",
        duration: 1 * 60 * 60 * 1000, // 1 heure
        httpOnly: true,
        ephemeral: true,
    })
);

app.engine("html", require("ejs").renderFile);
app.set("views", "./Public/views");
app.set("view engine", "ejs");

///////////////////////////////////////////
/* Mise en place des routes */

const { Login, Register, Programme, Projet, Tache } = require("./routes");

// page d'acceuil
app.get("/", (req, res) => {
    res.redirect("/Programmes");
});

app.use("/Login", Login);
app.use("/Register", Register);

// Login Middleware
const auth = require("./middleware/auth");
app.get("*", auth);
app.post("*", auth);
////////////

app.use("/Programmes", Programme);
app.use("/Projet", Projet);
app.use("/Tache", Tache);

// Doit être la dernière route
const routeErr = require("./middleware/routeErr");
app.use("*", routeErr);

////////////////////////////////////////////////
/* Démarrage du serveur */
app.listen(PORT, "localhost", () => {
    console.log(`> Serveur Running on : http://localhost:${PORT}`);
});

module.exports = app;
