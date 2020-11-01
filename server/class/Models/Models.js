const mongoose = require('mongoose');
const {
    searcherSchema,
    programSchema,
    projectSchema,
    taskSchema,
    advancementSchema
} = require('./Schema');

// Chercheur
const Searcher = mongoose.model('Searcher', searcherSchema);

// Programme
const Program = mongoose.model('Program', programSchema);


// Project
const Project = mongoose.model('Project', projectSchema);

// Tâche
const Task = mongoose.model('Task', taskSchema);

// Avancement
const Advancement = mongoose.model('Advancement', advancementSchema);

module.exports = {
    Searcher,
    Program,
    Project,
    Task,
    Advancement
};