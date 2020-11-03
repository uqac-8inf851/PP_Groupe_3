var express = require("express");

const TaskDAO = require("../../class/Dao/TaskDAO");

var router = express.Router();

// lecture de toutes les tâches du chercheur
router.get("/", (req, res) => {
    const { searcherId } = req.session;

    new TaskDAO()
        .getAllTaskForUser(searcherId)
        .then((tasks) => {
            res.render("index.ejs", {
                Tasks: tasks,
                template: "./Tache/Tache",
            });
        })
        .catch((err) => {
            console.error(err);
            res.render("index.ejs", {
                template: "./Utils/Error",
                err,
            });
        });
});

// redirige vers un formulaire de création de tâche
router.get("/Create/:projectId", (req, res) => {
    res.render("index.ejs", {
        template: "./Utils/Form",
        title: "Ajouter une tâche",
        action: "/Tache/Create",
        inputs: [
            { id: "name", name: "Nom de la tâche" },
            { id: "note", name: "Note sur la tâche (description)" },
            {
                id: "startingDate",
                name: "Date de début (opt.) - NE PAS TOUCHER EXPERIMENTAL",
                type: "number",
            },
            { id: "endingDate", name: "Date de fin (opt.) - NE PAS TOUCHER EXPERIMENTAL", type: "number" },
            { id: "duration", name: "Durée (opt.) en ms.", type: "number" },
            { id: "priority", name: "priorité", type: "number" },
            { id: "projectId", value: req.params.projectId, style: "display:none;" },
        ],
    });
});

// route de création d'une tâche
// params : name, note, startingDate, endingDate, priority, projectId
router.post("/Create", (req, res) => {
    const { name, note, startingDate, endingDate, priority, duration, projectId } = req.body;
    const { searcherId } = req.session;

    new TaskDAO()
        .create(searcherId, name, note, startingDate, endingDate, priority, duration, projectId)
        .then(() => {
            return res.redirect("/Tache");
        })
        .catch((err) => {
            console.error(err);
            res.render("index.ejs", {
                template: "./Utils/Error",
                err,
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
            return res.redirect("/Tache");
        })
        .catch((err) => {
            console.error(err);
            res.render("index.ejs", {
                template: "./Utils/Error",
                err,
            });
        });
});

// supprime la tâche
router.post("/Delete/:id", (req, res) => {
    const { id } = req.params;

    new TaskDAO()
        .deleteById(id)
        .then(() => {
            return res.redirect("/Tache");
        })
        .catch((err) => {
            console.error(err);
            res.render("index.ejs", {
                template: "./Utils/Error",
                err,
            });
        });
});

module.exports = router;
