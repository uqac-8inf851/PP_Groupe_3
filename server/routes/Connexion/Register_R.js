var express = require("express");
const logger = require("../../config/logger/winston");

const SearcherDAO = require("../../class/Dao/SearcherDAO");

var router = express.Router();

router.get("/", (req, res) => {
    res.render("./Connexion/Register.ejs");
});

router.post("/", (req, res) => {
    const { email, password, name } = req.body;

    logger.info("Register (POST): Tentative de création de compte: %O", { email, name });

    new SearcherDAO()
        .create(email, password, name)
        .then(() => {
            logger.info("Nouvel utilisateur créé avec succès, redirection vers /Register ! User: %O", { email, name });
            return res.redirect("/Login");
        })
        .catch((err) => {
            logger.error(
                "Register (POST): SearcherDAO().validateConnexion(%s, password, %s) -> Erreur: %O",
                email,
                name,
                err
            );
            // todo gestion des erreurs
            return res.redirect("/Register");
        });
});

module.exports = router;
