var express = require("express");
const logger = require("../../config/logger/winston");

const ProgrammeDAO = require("../../class/Dao/ProgrammeDAO");

var router = express.Router();

router.get("/", (req, res) => {
    new ProgrammeDAO()
        .findAllByUserId(req.session.searcherId)
        .then((programmes) => {
            logger.info("/Programmes (GET) Accès réussi pour l'utilisateur '%s'", req.session.searcherId);
            return res.render("index.ejs", {
                Programmes: programmes,
                template: "./Programme/Programme",
                Title: "Mes programmes",
                Link: "/Programmes",
            });
        })
        .catch((err) => {
            logger.error(
                "Programmes (GET): ProgrammeDAO().findAllByUserId(%s) -> Erreur: %O",
                req.session.searcherId,
                err
            );
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
            logger.info(
                "Programmes/Create (POST): Programme '%s' créé avec succès -> Redirection vers '/Programmes'",
                name
            );
            return res.redirect("/Programmes");
        })
        .catch((err) => {
            logger.error(
                "Programmes/Create (POST): ProgrammeDAO().create(%s, %s, %s) -> Erreur: %O",
                name,
                description,
                req.session.searcherId,
                err
            );
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
            logger.info(
                "Programmes/AddSearcher/%s (POST) -> Ajout avec succès du chercheur '%s' au programme %s. Redirection vers /Programmes",
                req.params.programId,
                req.body.email,
                req.params.programId
            );
            return res.redirect("/Programmes");
        })
        .catch((err) => {
            logger.error(
                "Programmes/AddSearcher/%s (POST) -> Erreur à l'ajout du chercheur '%s' au programme %s. Erreur: %O",
                req.params.programId,
                req.body.email,
                req.params.programId,
                err
            );
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
            logger.info(
                "Programmes/delete/%s (POST) -> Suppression du programme %s avec succès. Redirection vers /Programmes",
                req.params.id,
                req.params.id
            );
            return res.redirect("/Programmes");
        })
        .catch((err) => {
            logger.error(
                "Programmes/delete/%s (POST) -> Erreur lors de la suppression du programme %s. Erreur: %O",
                req.params.id,
                req.params.id,
                err
            );
            return res.render("index.ejs", {
                template: "./Utils/Error",
                err,
                Title: "Erreur",
                Link: "",
            });
        });
});

module.exports = router;
