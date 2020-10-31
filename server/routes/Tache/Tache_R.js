var express = require('express');

const TaskDAO = require('../../class/Models/TaskDAO');
var mongoose = require('mongoose');

var router = express.Router();

router.post('/Read', (req, res) => {
    const { taskId } = req.body;
    new TaskDAO().findById(taskId).then(task => {
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
                advancements,
                subTasks,
        } = task;
        
        // todo (mettre la bonne page)
        res.render('./Tache/Tache', taskDisplay);
    }).catch(err => {
        console.error(err);
        // todo (mettre la bonne page)
        res.render('./Utils/Error', { title: "Erreur à la lecture de votre tâche", message: JSON.stringify(err) });
    });
});

// route de création d'une tâche
// params : name, note, startingDate, endingDate, priority, projectId
router.post('/Create', (req, res) => {
    
    const { name, note, startingDate, endingDate, priority, duration, projectId } = req.body;
    const { searcherId } = req.session;

    new TaskDAO().create(searcherId, name, note, startingDate, endingDate, priority, duration, projectId).then(task => {
        // todo (mettre la bonne page)
        res.render('./Utils/Log', { title : "La tâche a bien été créée", log : JSON.stringify(task) });
    }).catch(err => {
        console.error(err);
        // todo (mettre la bonne page)
        res.render('./Utils/Error', { title: "Erreur à l'ajout de votre tâche", message: JSON.stringify(err) });
    });
});

// supprime la tâche
router.post('/Delete', (req, res) => {
    
    const { taskId } = req.body;

    new TaskDAO().deleteById(taskId).then(() => {
        // todo (mettre la bonne page)
        res.render('./Utils/Log', { title : "La tâche à bien été supprimée", log : "" });
    }).catch(err => {
        console.error(err);
        // todo (mettre la bonne page)
        res.render('./Utils/Error', { title: "Erreur à la suppression de la tâche", message: JSON.stringify(err) });
    });
});

// lecture de toutes les tâches du chercheur
router.get('/My', (req, res) => {
    
    const { searcherId } = req.session;

    new TaskDAO().getAllTaskForUser(searcherId).then(tasks => {
        // todo (mettre la bonne page)
        res.render('./Utils/Log', { title : "Liste de mes tâches", log : JSON.stringify(tasks) });
    }).catch(err => {
        console.error(err);
        // todo (mettre la bonne page)
        res.render('./Utils/Error', { title: "Erreur à l'ajout de votre tâche", message: JSON.stringify(err) });
    });
});

module.exports = router;