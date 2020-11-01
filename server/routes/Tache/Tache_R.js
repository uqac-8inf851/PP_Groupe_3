var express = require('express');

const TaskDAO = require('../../class/Models/TaskDAO');

var router = express.Router();

// lecture de toutes les tâches du chercheur
router.get('/', (req, res) => {
    
    const { searcherId } = req.session;

    new TaskDAO().getAllTaskForUser(searcherId).then(tasks => {
        res.render('index.ejs', { Tasks: tasks, template: './Tache/Tache' });
    }).catch(err => {
        console.error(err);
        res.render('index.ejs', {
            template: './Utils/Error',
            title: "Erreurs à la lecture de vos tâches", message: JSON.stringify(err)
        });
    });
});

// redirige vers un formulaire de création de projet
router.get('/Create', (req, res) => {

    res.render('index.ejs', {
        template: './Utils/Form',
        title: "Ajouter une tâche",
        action: "/Tache/Create",
        inputs: [
            { id: "name", name: "Nom de la tâche" },
            { id: "note", name: "Note sur la tâche (description)" },
            { id: "startingDate", name: "Date de début (opt.)", type: "number" },
            { id: "endingDate", name: "Date de fin (opt.)", type: "number" },
            { id: "duration", name: "Durée (opt.) en ms.", type: "number" },
            { id: "priority", name: "priorité", type: "number" },
            { id: "projectId", name: "Id du projet (en prendre un en bd)" }
        ]
    });
});

// route de création d'une tâche
// params : name, note, startingDate, endingDate, priority, projectId
router.post('/Create', (req, res) => {
    
    const { name, note, startingDate, endingDate, priority, duration, projectId } = req.body;
    const { searcherId } = req.session;

    new TaskDAO().create(searcherId, name, note, startingDate, endingDate, priority, duration, projectId).then(task => {
        return res.redirect("/Tache");
    }).catch(err => {
        console.error(err);
        res.render('index.ejs', {
            template: './Utils/Error',
            title: "Erreur à l'ajout de votre tâche", message: JSON.stringify(err)
        });
    });
});

// ajout d'un chercheur à la tâche
router.post('/AddSearcher/:taskId', (req, res) => {
    
    const { email } = req.body;
    const { taskId } = req.params;

    new TaskDAO().addSearcherToTask(email, taskId).then(() => {
        return res.redirect("/Tache");
    }).catch(err => {
        console.error(err);
        res.render('index.ejs', {
            template: './Utils/Error',
            title: "Erreur à l'ajout d'un chercheur à la tâche", message: JSON.stringify(err)
        });
    });
});

// supprime la tâche
router.post('/Delete/:id', (req, res) => {
    
    const { id } = req.params;

    new TaskDAO().deleteById(id).then(() => {
        return res.redirect("/Tache");
    }).catch(err => {
         console.error(err);
        res.render('index.ejs', {
            template: './Utils/Error',
            title: "Erreur à la suppression de la tâche", message: JSON.stringify(err)
        });
    });
});

module.exports = router;