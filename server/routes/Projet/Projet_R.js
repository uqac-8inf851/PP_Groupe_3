var express = require('express');

const ProjetDAO = require('../../class/Models/ProjetDAO');

var router = express.Router();

// lecture de tous les projets du chercheur
router.get('/', (req, res) => {
    
    const { searcherId } = req.session;

    new ProjetDAO().getAllProjectForUser(searcherId).then(projects => {
        res.render('index.ejs', { Projets: projects, template: './Projet/Projet' });
    }).catch(err => {
        console.error(err);
        res.render('index.ejs', {
            template: './Utils/Error',
            title: "Erreur à la lecture de vos projets", message: JSON.stringify(err)
        });
    });
});

// redirige vers un formulaire de création de projet
router.get('/Create', (req, res) => {

    res.render('index.ejs', {
        template: './Utils/Form',
        title: "Ajouter un projet",
        action: "/Projet/Create",
        inputs: [
            { id: "name", name: "Nom du projet" },
            { id: "description", name: "Description du projet" },
            { id: "programId", name: "Id du programme (prendre un en BD)" },
        ]
    });
});

// route de création d'un projet
// params : name, description, programId
router.post('/Create', (req, res) => {
    
    const { name, description, programId } = req.body;
    const { searcherId } = req.session;

    new ProjetDAO().create(searcherId, name, description, programId).then(task => {
        res.redirect('/Projet');
    }).catch(err => {
        console.error(err);
        res.render('index.ejs', {
            template: './Utils/Error',
            title: "Erreur à l'ajout de votre projet", message: JSON.stringify(err)
        });
    });
});

// lecture de tous les projets du chercheur
router.post('/AddSearcher/:projectId', (req, res) => {
    
    const { email } = req.body;
    const { projectId } = req.params;

    new ProjetDAO().addSearcherToProject(email, projectId).then(() => {
        return res.redirect("/Projet");
    }).catch(err => {
        console.error(err);
        res.render('index.ejs', {
            template: './Utils/Error',
            title: "Erreur à l'ajout d'un chercheur au projet", message: JSON.stringify(err)
        });
    });
});

// supprime le projet
router.post('/Delete/:id', (req, res) => {
    
    const { id } = req.params;

    new ProjetDAO().deleteById(id).then(() => {
        return res.redirect("/Projet");
    }).catch(err => {
         console.error(err);
        res.render('index.ejs', {
            template: './Utils/Error',
            title: "Erreur à la suppression du projet", message: JSON.stringify(err)
        });
    });
});

module.exports = router;