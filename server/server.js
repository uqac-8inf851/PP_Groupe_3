// par défaut l'environnement est dev
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// modules
const express = require("express");
const bodyParser = require("body-parser");
const sessions = require("client-sessions");

// connection database
const connectDB = require("./config/database/db");

// selection du port
const PORT = require("./config/port").PORT;

// selection du host
const HOST = require("./config/host").HOST;

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
app.listen(PORT, HOST, () => {
    console.log(`> Serveur Running on : http://${HOST}:${PORT}`);
});

module.exports = app;
