var express = require("express");
const logger = require("../../config/logger/winston");

const TaskDAO = require("../../class/Dao/TaskDAO");

var router = express.Router();

// lecture de toutes les tâches du chercheur
router.get("/", (req, res) => {
    const { searcherId } = req.session;

    new TaskDAO()
        .getAllTaskForUser(searcherId)
        .then((tasks) => {
            logger.info("/Taches (GET) Accès réussi pour l'utilisateur '%s'", searcherId);
            return res.render("index.ejs", {
                Tasks: tasks,
                template: "./Tache/Tache",
                Title: "Mes tâches",
                Link: "/Tache",
            });
        })
        .catch((err) => {
            logger.error("/Taches (GET): TaskDAO().getAllTaskForUser(%s) -> Erreur: %O", searcherId, err);
            return res.render("index.ejs", {
                template: "./Utils/Error",
                err,
                Title: "Erreur",
                Link: "",
            });
        });
});

// redirige vers un formulaire de création de tâche
router.get("/Create/:projectId", (req, res) => {
    res.render("index.ejs", {
        template: "./Utils/Form",
        formTitle: "Ajouter une tâche",
        action: "/Tache/Create",
        inputs: [
            { id: "name", name: "Nom de la tâche" },
            { id: "note", name: "Note sur la tâche (description)" },
            {
                id: "startingDate",
                name: "Date de début (opt.)",
                type: "date",
                value: "2020-10-01",
            },
            { id: "endingDate", name: "Date de fin (opt.)", type: "date", value: "2020-11-01" },
            { id: "duration", name: "Durée (opt.) en heure", type: "number" },
            { id: "priority", name: "priorité", type: "number" },
            { id: "projectId", value: req.params.projectId, style: "display:none;" },
        ],
        Title: "Créer une tâche",
        Link: "",
    });
});

// route de création d'une tâche
// params : name, note, startingDate, endingDate, priority, projectId
router.post("/Create", (req, res) => {
    const { name, note, startingDate, endingDate, priority, duration, projectId } = req.body;
    const { searcherId } = req.session;

    const modifiedDuration = duration * 60 * 60 * 1000; // temp

    new TaskDAO()
        .create(searcherId, name, note, startingDate, endingDate, priority, modifiedDuration, projectId)
        .then(() => {
            logger.info("Tache/Create (POST): Tâche '%s' créée avec succès -> Redirection vers '/Tache'", name);
            return res.redirect("/Tache");
        })
        .catch((err) => {
            logger.error(
                "Tache/Create (POST): TaskDAO().create(%s, %s, %s, %s, %s, %s, %s, %s) -> Erreur: %O",
                searcherId,
                name,
                note,
                startingDate,
                endingDate,
                priority,
                modifiedDuration,
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

// ajout d'un chercheur à la tâche
router.post("/AddSearcher/:taskId", (req, res) => {
    const { email } = req.body;
    const { taskId } = req.params;

    new TaskDAO()
        .addSearcherToTask(email, taskId)
        .then(() => {
            logger.info(
                "Tache/AddSearcher/%s (POST) -> Ajout avec succès du chercheur '%s' à la tâche %s. Redirection vers /Tache",
                taskId,
                email,
                taskId
            );
            return res.redirect("/Tache");
        })
        .catch((err) => {
            logger.error(
                "Projet/AddSearcher/%s (POST) -> Erreur à l'ajout du chercheur '%s' à la tâche %s. Erreur: %O",
                taskId,
                email,
                taskId,
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

// supprime la tâche
router.post("/Delete/:id", (req, res) => {
    const { id } = req.params;

    new TaskDAO()
        .deleteById(id)
        .then(() => {
            logger.info(
                "Tache/delete/%s (POST) -> Suppression de la tâche %s avec succès. Redirection vers /Tache",
                id,
                id
            );
            return res.redirect("/Tache");
        })
        .catch((err) => {
            logger.error(
                "Tache/delete/%s (POST) -> Erreur lors de la suppression de la tâche %s. Erreur: %O",
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
