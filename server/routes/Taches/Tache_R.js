var express = require('express');

const { Task } = require('../../class/Models/Models');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

var router = express.Router();

// Tâche :
//     - id (unique string)
//     - nom (string)
//     - notes (string)
//     - est archivé (boolean)
//     - status (int -> enum)
//          - 0 : en cours
//          - 1 : finie
//          - 2 : en attente
//     - date début (date)
//     - date fin (date)
//     - durée (int)
//     - durée passée (int)
//     - priorité (int -> enum)
//     - chercheurs (id[] #Chercheur)
//     - avancements (id[] #Avancement)
//     - sous-tâches (id[] #Tâche)
//     - référence projet (id #Projet)

router.get ('/Create', (req, res) => {

    res.render('./Utils/Form', {
        title: "Ajouter une tâche",
        action: "/Tache/Create",
        inputs: [
            { id: "name", name: "Nom de la tâche" },
            { id: "note", name: "Note sur la tâche (description)" },
            { id: "startingDate", name: "Date de début (opt.)", type: "number" },
            { id: "endingDate", name: "Date de fin (opt.)", type: "number" },
            { id: "priority", name: "priorité", type: "number" },
        ]
    });
})

// fonction de création d'une tâche
// name, note, startingDate, endingDate, priority, projectID
router.post('/Create', (req, res) => {

    const { name, note, startingDate, endingDate, priority } = req.body;

    const data = {
        name,
        note,
        searchers: [ObjectId()], /* à remplacer par l'id du chercheur en cours */
        advancements: [],
        subTasks: [],
        projectRef : ObjectId() /* à remplacer par l'id du projet en cours */
    };

    data.priority = Number(priority);

    if (startingDate !== null && endingDate !== null) {
        data.startingDate = new Date(Number(startingDate));
        data.endingDate = new Date(Number(endingDate));
        data.duration = data.endingDate - data.startingDate;
        data.elapsedDuration = 0;
    }
    else if (endingDate !== null && startingDate === null) {
        data.startingDate = new Date(Date.now());
        data.endingDate = new Date(Number(endingDate));
        data.duration = data.endingDate - data.startingDate;
        data.elapsedDuration = 0;
    }
    else if (startingDate !== null && endingDate === null) {
        data.startingDate = new Date(Number(startingDate));
    }

    const taskDocument = new Task(data);

    taskDocument.save(err => {
        if (err) {
            console.error(err);
            // renvoyé un feedback d'erreur
            // TODO
            res.render('./Utils/Log', { title : "Erreur à l'ajout de votre tâche", log : JSON.stringify(err) });
        }
        res.render('./Utils/Log', { title : "Bravo ça a marché", log : JSON.stringify(taskDocument) });
    });
});

// router.post('/Create', (req, res) => {

//     const newPrograme  = new Programme (req.body)

//     newPrograme.save ( err => { if ( err) { console.log(err) } })

//     // A changer real Page
//     res.render('./Connexion/Register.ejs')
// });

// router.get('/:taskID', (req, res) => {

//     res.render('./Log', { title: "On test des trucs", log: JSON.stringify(req.body) });
// })

module.exports = router;