const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const faker = require("faker");

// génére un set de données avec 2 chercheurs, 1 programme, 1 projet, 1 tâche et 1 avancement

const password = "1234";
var hashedPassword = null;
const salt = bcrypt.genSaltSync(10); // génération sel
hashedPassword = bcrypt.hashSync(password, salt); // hachage du mot de passe

const searcher1 = {
    _id: mongoose.Types.ObjectId(),
    password: hashedPassword,
    email: faker.internet.email(),
    name: faker.name.findName(),
    preferences: "",
    programs: [],
    projects: [],
    tasks: [],
};

const searcher2 = {
    _id: mongoose.Types.ObjectId(),
    password: hashedPassword,
    email: faker.internet.email(),
    name: faker.name.findName(),
    preferences: "",
    programs: [],
    projects: [],
    tasks: [],
};

const program = {
    _id: mongoose.Types.ObjectId(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    isArchived: false,
    administrator: searcher1._id,
    searchers: [searcher1._id],
    projects: [],
};

searcher1.programs.push(program._id);

const project = {
    _id: mongoose.Types.ObjectId(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    isArchived: false,
    searchers: [searcher1._id],
    tasks: [],
    programRef: program._id,
};

program.projects.push(project._id);
searcher1.projects.push(project._id);

const fakeId = mongoose.Types.ObjectId();

const task = {
    _id: mongoose.Types.ObjectId(),
    name: faker.commerce.productName(),
    note: faker.commerce.productDescription(),
    isArchived: false,
    status: faker.random.number(3),
    startingDate: faker.date.recent(),
    endingDate: faker.date.soon(),
    duration: faker.random.number(1000000000),
    elapsedDuration: 0,
    priority: faker.random.number(10),
    searchers: [searcher1._id],
    advancements: [],
    subTasks: [],
    projectRef: project._id,
};

project.tasks.push(task._id);
searcher1.tasks.push(task._id);

const advancement = {
    _id: mongoose.Types.ObjectId(),
    startingDate: new Date(Date.now() - faker.random.number(1000000000)),
    endingDate: new Date(Date.now()),
    searcher: searcher1._id,
    taskRef: task._id,
};

task.advancements.push(advancement._id);

const dummyGenerateData = {
    searcher: () => {
        return {
            password: hashedPassword,
            email: faker.internet.email(),
            name: faker.name.findName(),
        };
    },

    program: () => {
        return {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
        };
    },

    project: () => {
        return {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
        };
    },

    task: () => {
        return {
            name: faker.commerce.productName(),
            note: faker.commerce.productDescription(),
            startingDate: faker.date.recent(),
            endingDate: faker.date.soon(),
            duration: faker.random.number(1000000000),
            priority: faker.random.number(10),
        };
    },

    advancement: () => {
        return {
            startingDate: new Date(Date.now() - faker.random.number(1000000000)),
            endingDate: new Date(Date.now()),
        };
    },
};

module.exports = {
    searcher1,
    searcher2,
    program,
    project,
    task,
    advancement,
    uncryptedPassword: password,
    fakeId,
    dummyGenerateData,
};
