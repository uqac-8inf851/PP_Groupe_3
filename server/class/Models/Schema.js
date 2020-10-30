const mongoose = require('mongoose');

const { Schema } = mongoose;

// Chercheur :
//     - id (unique string)
//     - nom (string)
//     - adresse mail (string)
//     - hash mot de passe (string)
//     - historique de recherche (string[])
//     - preferences (obj)
//     - est un admin (boolean)
//     - programmes (id[] #Programme)
//     - projets (id[] #Projet)
//     - tâches (id[] #Tâche)

const searcherSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto :true },
    name: { type : String, required : true },
    email: { type : String, required : true, unique : true },
    password: { type : String, required : true },
    preferences: String, // obj JSON stringifié
    programs: [Schema.Types.ObjectId],
    projects: [Schema.Types.ObjectId],
    tasks: [Schema.Types.ObjectId]
}, {strict : true});

// Programme :
//     - id (unique string)
//     - nom (string)
//     - description (string)
//     - est archivé (boolean)
//     - directeur programme (id #Chercheur)
//     - chercheurs (id[] #Chercheur)
//     - projets (id[] #Projet)

const programSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type : String, required : true },
    description: { type : String},
    isArchived: { type: Boolean},
    administrator: { type: Schema.Types.ObjectId, required : true},
    searchers: { type: [Schema.Types.ObjectId], required: true},
    projects: { type: [Schema.Types.ObjectId]},
},{strict : true});

{

}

// Projets :
//     - id (unique string)
//     - nom (string)
//     - description (string)
//     - est archivé (boolean)
//     - chercheurs (id[] #Chercheur)
//     - tâches (id[] #Tâche)
//     - référence programme (id #Programme)

const projectSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    name: { type : String, required : true },
    description: { type : String, required : true },
    isArchived: { type: Boolean, required: true },
    searchers: { type: [Schema.Types.ObjectId], required: true },
    tasks: { type: [Schema.Types.ObjectId], required: true },
    programRef : { type: [Schema.Types.ObjectId], required: true }
}, {strict : true} );

// Tâche :
//     - id (unique string)
//     - nom (string)
//     - notes (string)
//     - est archivé (boolean)
//     - status (int -> enum)
//     - date début (date)
//     - date fin (date)
//     - durée (int)
//     - durée passée (int)
//     - priorité (int -> enum)
//     - chercheurs (id[] #Chercheur)
//     - avancements (id[] #Avancement)
//     - sous-tâches (id[] #Tâche)
//     - référence projet (id #Projet)

const taskSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    name: { type : String, required : true },
    note: { type : String, required : true },
    isArchived: { type: Boolean, required: true },
    status: { type: Number, required: true },
    startingDate: { type : Date, required : true },
    endingDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    elapsedDuration: { type: Number, required: true },
    priority: { type: Number, required: true },
    searchers: { type: [Schema.Types.ObjectId], required: true },
    advancements: { type: [Schema.Types.ObjectId], required: true },
    subTasks: { type: [Schema.Types.ObjectId], required: true },
    projectRef : { type: Schema.Types.ObjectId, required: true }
}, {strict : true} );

// Avancement :
//     - début (date)
//     - fin (date)
//     - chercheur (id #Chercheur)
//     - référence tâche (id #Tâche)

const advancementSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    startingDate: { type : Date, required : true },
    endingDate: { type : Date, required : true },
    searcher: { type: Schema.Types.ObjectId, required: true },
    taskRef: { type: Schema.Types.ObjectId, required: true },
}, {strict : true} );

module.exports = {
    searcherSchema,
    programSchema,
    projectSchema,
    taskSchema,
    advancementSchema
}