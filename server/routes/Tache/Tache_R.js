var express = require('express');

const { Task } = require('../../class/Models/Models');
var mongoose = require('mongoose');

var router = express.Router();

// Tâche :

// const taskSchema = new Schema({
//     name: { type : String, required : true },
//     note: { type : String },
//     isArchived: { type: Boolean, required: true, default : false },
//     status: { type: Number, required: true, default : false },
//     startingDate: { type : Date, required : true },
//     endingDate: { type: Date, required: true },
//     duration: { type: Number, required: true },
//     elapsedDuration: { type: Number, required: true },
//     priority: { type: Number, required: true },
//     searchers: { type: [Schema.Types.ObjectId], required: true },
//     advancements: { type: [Schema.Types.ObjectId], required: true },
//     subTasks: { type: [Schema.Types.ObjectId], required: true },
//     projectRef : { type: Schema.Types.ObjectId, required: true }
// });

// temporaire (ne devrait pas exister)
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
            { id: "projectRef", name: "Ref projet (ne pas toucher)", value: "5f9c33af3dd63e18a8f7e42c" },
        ]
    });
});

// fonction de création d'une tâche
// name, note, startingDate, endingDate, priority, projectID
router.post('/Create', (req, res) => {

    const { name, note, startingDate, endingDate, priority, duration, projectRef } = req.body;

    if (!("session" in req && "searcherId" in req.session)) { // si la variable de session n'est pas complète
        return res.redirect('/Login');
    }
    
    const { searcherId } = req.session.searcherId;

    const data = {
        name,
        note,
        searchers: [searcherId],
        advancements: [],
        subTasks: [],
        projectRef /* à remplacer par l'id du projet en cours */
    };

    data.priority = Number(priority);
    data.duration = Number(duration);

    if (startingDate !== null) {
        data.startingDate = new Date(Number(startingDate));
        data.elapsedDuration = 0;
    }
    
    if (endingDate !== null) {
        data.endingDate = new Date(Number(endingDate));
        data.elapsedDuration = 0;
    }

    const taskDocument = new Task(data);

    taskDocument.save(err => {
        if (err) {
            console.error(err);
            // renvoyé un feedback d'erreur
            // TODO
            res.render('./Utils/Error', { title : "Erreur à l'ajout de votre tâche", message : JSON.stringify(err) });
        }
        res.render('./Utils/Log', { title : "Bravo ça a marché", log : JSON.stringify(taskDocument) });
    });
});

router.get('/Read', (req, res) => {
    
    res.render('./Tache/GetTache');
});

router.get('/Read/:taskId', (req, res) => {
    
    const { taskId } = req.params;

    Task.findById(taskId, (err, task) => {

        if (err) {
            console.error(err);
            return res.render('./Utils/Error', { title: "Erreur à la lecture de votre tâche", message: JSON.stringify(err) });
        }

        if (!task) {
            res.render('./Utils/Error', { title: "La tâche que vous cherchez n'existe pas", message: "Vous avez du entrer un id incorrect" });
        }
        else {
            const taskDisplay = {
                name,
                note,
                isArchived,
                status,
                startingDate,
                endingDate,
                duration,
                elapsedDuration,
                priority,
                searchers,
                advancements,
                subTasks,
            } = task;

            res.render('./Tache/Tache', taskDisplay);
        }
    });
});

module.exports = router;