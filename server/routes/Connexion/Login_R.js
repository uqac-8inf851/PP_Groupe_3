const express = require("express");
const logger = require("../../config/logger/winston");

const SearcherDAO = require("../../class/Dao/SearcherDAO");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("./Connexion/Login.ejs");
});

router.post("/", (req, res) => {
    const { email, password } = req.body;

    logger.info("Login (POST): Tentative de connection sur l'adresse mail %s", email);

    new SearcherDAO()
        .validateConnexion(email, password)
        .then((searcherId) => {
            req.session.searcherId = searcherId; // on ajoute l'id de l'utilisateur à sa session
            logger.info("Login (POST): Utilisateur connecté avec succès, redirection vers /Programmes ! User: %O", {
                id: req.session.searcherId,
                email,
            });
            return res.redirect("/Programmes");
        })
        .catch((err) => {
            logger.error("Login (POST): SearcherDAO().validateConnexion(%s, password) -> Erreur: %O", email, err);
            return res.redirect("/Login");
        });
});

module.exports = router;
