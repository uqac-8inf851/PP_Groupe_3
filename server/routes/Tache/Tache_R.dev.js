// contient les routes de tests (pas utilisé quand le projet sera fini)
var express = require('express');

const TaskDAO = require('../../class/Models/TaskDAO');
var mongoose = require('mongoose');

var router = express.Router();

// redirige vers un formulaire de création de tâche
router.get('/Create', (req, res) => {

    res.render('./Utils/Form', {
        title: "Ajouter une tâche",
        action: "/Tache/Create",
        inputs: [
            { id: "name", name: "Nom de la tâche" },
            { id: "note", name: "Note sur la tâche (description)" },
            { id: "startingDate", name: "Date de début (opt.)", type: "number" },
            { id: "endingDate", name: "Date de fin (opt.)", type: "number" },
            { id: "duration", name: "Durée (opt.) en ms.", type: "number" },
            { id: "priority", name: "priorité", type: "number" },
            { id: "projectId", name: "Id du projet (ne pas toucher)", value: "5f9c33af3dd63e18a8f7e42c" },
        ]
    });
});

// permet de rechercher une tâche
router.get('/Read', (req, res) => {
    
    res.render('./Utils/Form', {
        title: "Rechercher une tâche",
        action: "/Tache/Read",
        inputs: [
            { id: "taskId", name: "Id de la tâche", value : "" },
        ]
    });
});

// permet de supprimer une tâche
router.get('/Delete', (req, res) => {
    
    res.render('./Utils/Form', {
        title: "Supprimer une tâche",
        action: "/Tache/Delete",
        inputs: [
            { id: "taskId", name: "Id de la tâche", value : "" },
        ]
    });
});

module.exports = router;