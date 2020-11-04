var express = require("express");

const ProgrammeDAO = require("../../class/Dao/ProgrammeDAO");

var router = express.Router();

router.get("/", (req, res) => {
    new ProgrammeDAO()
        .findAllByUserId(req.session.searcherId)
        .then((programmes) => {
            return res.render("index.ejs", {
                Programmes: programmes,
                template: "./Programme/Programme",
                Title: "Mes programmes",
                Link: "/Programmes",
            });
        })
        .catch((err) => {
            console.error(err);
            return res.render("index.ejs", {
                template: "./Utils/Error",
                err,
                Title: "Erreur",
                Link: "",
            });
        });
});

router.get("/Create", (req, res) => {
    res.render("index.ejs", {
        template: "./Utils/Form",
        formTitle: "Ajouter un programme",
        action: "/Programmes/Create",
        inputs: [
            { id: "name", name: "Nom du programme" },
            { id: "description", name: "Description du programme" },
        ],
        Title: "Créer un programme",
        Link: "",
    });
});

router.post("/Create", (req, res) => {
    const { name, description } = req.body;
    new ProgrammeDAO()
        .create(name, description, req.session.searcherId)
        .then(() => {
            return res.redirect("/Programmes");
        })
        .catch((err) => {
            console.error(err);
            return res.render("index.ejs", {
                template: "./Utils/Error",
                err,
                Title: "Erreur",
                Link: "",
            });
        });
});

router.post("/AddSearcher/:programId", (req, res) => {
    new ProgrammeDAO()
        .addSearcherToProgramme(req.body.email, req.params.programId)
        .then(() => {
            return res.redirect("/Programmes");
        })
        .catch((err) => {
            console.error(err);
            return res.render("index.ejs", {
                template: "./Utils/Error",
                err,
                Title: "Erreur",
                Link: "",
            });
        });
});

router.post("/delete/:id", (req, res) => {
    new ProgrammeDAO()
        .delete(req.params.id)
        .then(() => {
            return res.redirect("/Programmes");
        })
        .catch((err) => {
            console.error(err);
            return res.render("index.ejs", {
                template: "./Utils/Error",
                err,
                Title: "Erreur",
                Link: "",
            });
        });
});

module.exports = router;
