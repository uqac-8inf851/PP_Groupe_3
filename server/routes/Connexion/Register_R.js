var express = require("express");

const SearcherDAO = require("../../class/Dao/SearcherDAO");

var router = express.Router();

router.get("/", (req, res) => {
    res.render("./Connexion/Register.ejs");
});

router.post("/", (req, res) => {
    const { email, password, name } = req.body;

    new SearcherDAO()
        .create(email, password, name)
        .then(() => {
            return res.redirect("/Login");
        })
        .catch((err) => {
            console.error(err);
            // todo gestion des erreurs
            return res.redirect("/Register");
        });
});

module.exports = router;
