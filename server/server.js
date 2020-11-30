// l'environnement par défaut est "development"
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// chargement de la config (À LAISSER EN HAUT DU FICHIER, DOIT ÊTRE CHARGÉ EN PREMIER)
const config = require("./config/config");

// modules
const express = require("express");
const bodyParser = require("body-parser");
const sessions = require("client-sessions");
const morgan = require("morgan");

// import du logger
const logger = require("./config/logger/winston");

// connexion à la BD
require("./config/database/db")(config.DATABASE_URL);

// création de l'app
const app = express();

// Initialisation des middlewares
app.use(morgan("combined", { stream: logger.morganStream }));
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
app.get("/", (_, res) => {
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
app.listen(config.PORT, config.HOST, () => {
    console.log(`> Server Running on : http://${config.HOST}:${config.PORT}`);
    logger.info("> Server Running on : http://%s:%d", config.HOST, config.PORT);
});

module.exports = app;
