const mongoose = require('mongoose');
const { Searcher } = require('./Models');


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
    email: { type : String, required : true, unique : true , index :true},
    password: { type : String, required : true },
    preferences: String, // obj JSON stringifié
    programs: [{type : Schema.Types.ObjectId, required : true, ref :'Program'}],
    projects: [{type : Schema.Types.ObjectId, required : true, ref :'Project'}],
    tasks: [{type : Schema.Types.ObjectId, required : true, ref :'Task'}]
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
    administrator: { type: Schema.Types.ObjectId, required : true, ref: 'Searcher'},
    searchers: [{ type: Schema.Types.ObjectId, required: true, ref: 'Searcher'}],
    projects: [{ type: Schema.Types.ObjectId, required: true, ref: 'Project'}],
},{strict : true});

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
    description: { type : String },
    isArchived: { type: Boolean, required: true },
    searchers: [{ type: Schema.Types.ObjectId, required: true, ref: 'Searcher' }],
    tasks: [{ type: Schema.Types.ObjectId, required: true, ref: 'Task' }],
    programRef : [{ type: Schema.Types.ObjectId, required: true, ref: 'Program' }]
}, {strict : true} );


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

const taskSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    name: { type : String, required : true },
    note: { type : String},
    isArchived: { type: Boolean},
    status: { type: Number},
    startingDate: { type : Date },
    endingDate: { type: Date},
    duration: { type: Number},
    elapsedDuration: { type: Number},
    priority: { type: Number, required: true},
    searchers: [{ type: Schema.Types.ObjectId, ref : 'Searcher'}],
    advancements: [{ type: Schema.Types.ObjectId, ref : 'Advancement'}],
    subTasks: [{type : Schema.Types.ObjectId, ref :'Task'}],
    projectRef : [{ type: Schema.Types.ObjectId, ref : 'Project'}]
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
    searcher: { type: Schema.Types.ObjectId, required: true,ref : 'Searcher' },
    taskRef: { type: Schema.Types.ObjectId, required: true, ref : 'Task'} 
}, {strict : true} );

module.exports = {
    searcherSchema,
    programSchema,
    projectSchema,
    taskSchema,
    advancementSchema
}
