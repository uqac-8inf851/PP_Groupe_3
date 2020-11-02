const express = require("express");

const SearcherDAO = require("../../class/Dao/SearcherDAO");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("./Connexion/Login.ejs");
});

router.post("/", (req, res) => {
    const { email, password } = req.body;

    new SearcherDAO()
        .validateConnexion(email, password)
        .then((searcherId) => {
            req.session.searcherId = searcherId; // on ajoute l'id de l'utilisateur à sa session
            return res.redirect("/Programmes");
        })
        .catch((err) => {
            console.error(err);
            // todo gestion des erreurs
            return res.redirect("/Login");
        });
});

module.exports = router;
