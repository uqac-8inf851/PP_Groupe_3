const { after } = require("mocha");
const mongoose = require("mongoose");

const { Searcher, Program, Project, Task, Advancement } = require("../../server/class/Models/Models");

// on va ici ajouter en BD toutes les datas générées dans data.js

// création d'un set de data pour test
function createDataSet() {
    const dataSet = require("./data");

    const createPromises = [];

    // création des chercheurs
    createPromises.push(Searcher.create(dataSet.searcher1));
    createPromises.push(Searcher.create(dataSet.searcher2));

    // création des programmes
    createPromises.push(Program.create(dataSet.program));

    // création des projets
    createPromises.push(Project.create(dataSet.project));

    // création des tâches
    createPromises.push(Task.create(dataSet.task));

    // création des avancements
    createPromises.push(Advancement.create(dataSet.advancement));

    return Promise.all(createPromises);
}

// suppression des collections dans le BD de test
function deleteDataSet() {
    return mongoose.connection.dropDatabase();

    // const deletePromises = [];

    // // deletePromises.push(mongoose.connection.dropCollection("searchers"));
    // // deletePromises.push(mongoose.connection.dropCollection("programs"));
    // // deletePromises.push(mongoose.connection.dropCollection("projects"));
    // // deletePromises.push(mongoose.connection.dropCollection("tasks"));
    // // deletePromises.push(mongoose.connection.dropCollection("advancements"));

    // return Promise.all(deletePromises);
}

before((done) => {
    deleteDataSet()
        .then(() => {
            createDataSet()
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        })
        .catch((err) => {
            done(err);
        });
});
