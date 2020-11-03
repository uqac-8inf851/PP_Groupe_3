/* Modules */
const express = require("express");
const bodyParser = require("body-parser");
const sessions = require("client-sessions");

const connectDB = require("./config/database/db");

const PORT = 5500;

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
        duration: 5 * 60 * 1000,
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
