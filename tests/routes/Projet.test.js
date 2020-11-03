// var express = require("express");

// const ProjetDAO = require("../../class/Dao/ProjetDAO");

// var router = express.Router();

// // lecture de tous les projets du chercheur
// router.get("/", (req, res) => {
//     const { searcherId } = req.session;

//     new ProjetDAO()
//         .getAllProjectForUser(searcherId)
//         .then((projects) => {
//             res.render("index.ejs", {
//                 Projets: projects,
//                 template: "./Projet/Projet",
//             });
//         })
//         .catch((err) => {
//             console.error(err);
//             res.render("index.ejs", {
//                 template: "./Utils/Error",
//                 err,
//             });
//         });
// });

// // redirige vers un formulaire de création de projet
// router.get("/Create/:programId", (req, res) => {
//     res.render("index.ejs", {
//         template: "./Utils/Form",
//         title: "Ajouter un projet",
//         action: "/Projet/Create",
//         inputs: [
//             { id: "name", name: "Nom du projet" },
//             { id: "description", name: "Description du projet" },
//             { id: "programId", value: req.params.programId, style: "display:none;" },
//         ],
//     });
// });

// // route de création d'un projet
// // params : name, description, programId
// router.post("/Create", (req, res) => {
//     const { name, description, programId } = req.body;
//     const { searcherId } = req.session;

//     new ProjetDAO()
//         .create(searcherId, name, description, programId)
//         .then(() => {
//             res.redirect("/Projet");
//         })
//         .catch((err) => {
//             console.error(err);
//             res.render("index.ejs", {
//                 template: "./Utils/Error",
//                 err,
//             });
//         });
// });

// // lecture de tous les projets du chercheur
// router.post("/AddSearcher/:projectId", (req, res) => {
//     const { email } = req.body;
//     const { projectId } = req.params;

//     new ProjetDAO()
//         .addSearcherToProject(email, projectId)
//         .then(() => {
//             return res.redirect("/Projet");
//         })
//         .catch((err) => {
//             console.error(err);
//             res.render("index.ejs", {
//                 template: "./Utils/Error",
//                 err,
//             });
//         });
// });

// // supprime le projet
// router.post("/Delete/:id", (req, res) => {
//     const { id } = req.params;

//     new ProjetDAO()
//         .deleteById(id)
//         .then(() => {
//             return res.redirect("/Projet");
//         })
//         .catch((err) => {
//             console.error(err);
//             res.render("index.ejs", {
//                 template: "./Utils/Error",
//                 err,
//             });
//         });
// });

// module.exports = router;
