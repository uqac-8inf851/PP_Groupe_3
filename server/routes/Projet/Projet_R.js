var express = require("express");
const logger = require("../../config/logger/winston");

const ProjetDAO = require("../../class/Dao/ProjetDAO");

var router = express.Router();

// lecture de tous les projets du chercheur
router.get("/", (req, res) => {
    const { searcherId } = req.session;

    new ProjetDAO()
        .getAllProjectForUser(searcherId)
        .then((projects) => {
            logger.info("/Projet (GET) Accès réussi pour l'utilisateur '%s'", searcherId);
            return res.render("index.ejs", {
                Projets: projects,
                template: "./Projet/Projet",
                Title: "Mes projets",
                Link: "/Projet",
            });
        })
        .catch((err) => {
            logger.error("/Projet (GET): ProjetDAO().getAllProjectForUser(%s) -> Erreur: %O", searcherId, err);
            return res.render("index.ejs", {
                template: "./Utils/Error",
                err,
                Title: "Erreur",
                Link: "",
            });
        });
});

// redirige vers un formulaire de création de projet
router.get("/Create/:programId", (req, res) => {
    res.render("index.ejs", {
        template: "./Utils/Form",
        formTitle: "Ajouter un projet",
        action: "/Projet/Create",
        inputs: [
            { id: "name", name: "Nom du projet" },
            { id: "description", name: "Description du projet" },
            { id: "programId", value: req.params.programId, style: "display:none;" },
        ],
        Title: "Créer un projet",
        Link: "",
    });
});

// route de création d'un projet
// params : name, description, programId
router.post("/Create", (req, res) => {
    const { name, description, programId } = req.body;
    const { searcherId } = req.session;

    new ProjetDAO()
        .create(searcherId, name, description, programId)
        .then(() => {
            logger.info("Projet/Create (POST): Projets '%s' créé avec succès -> Redirection vers '/Projet'", name);
            return res.redirect("/Projet");
        })
        .catch((err) => {
            logger.error(
                "Projet/Create (POST): ProjetDAO().create(%s, %s, %s, %s) -> Erreur: %O",
                searcherId,
                name,
                description,
                programId,
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

// lecture de tous les projets du chercheur
router.post("/AddSearcher/:projectId", (req, res) => {
    const { email } = req.body;
    const { projectId } = req.params;

    new ProjetDAO()
        .addSearcherToProject(email, projectId)
        .then(() => {
            logger.info(
                "Projet/AddSearcher/%s (POST) -> Ajout avec succès du chercheur '%s' au projet %s. Redirection vers /Projet",
                projectId,
                email,
                projectId
            );
            return res.redirect("/Projet");
        })
        .catch((err) => {
            logger.error(
                "Projet/AddSearcher/%s (POST) -> Erreur à l'ajout du chercheur '%s' au projet %s. Erreur: %O",
                projectId,
                email,
                projectId,
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

// supprime le projet
router.post("/Delete/:id", (req, res) => {
    const { id } = req.params;

    new ProjetDAO()
        .deleteById(id)
        .then(() => {
            logger.info(
                "Projet/delete/%s (POST) -> Suppression du projet %s avec succès. Redirection vers /Projet",
                id,
                id
            );
            return res.redirect("/Projet");
        })
        .catch((err) => {
            logger.error(
                "Projet/delete/%s (POST) -> Erreur lors de la suppression du projet %s. Erreur: %O",
                id,
                id,
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
