const { Program, Project, Searcher } = require("../Models/Models");
const TaskDAO = require("./TaskDAO");
const { error } = require("../../utils");

class ProjetDAO {
    create(searcherId, name, description, programId) {
        const defaultErrorMessage = "Une erreur est survenue lors de la création du projet";
        return new Promise((resolve, reject) => {
            const data = {
                name,
                description,
                searchers: [searcherId],
                programRef: programId,
            };

            const project = new Project(data);

            project.save((err) => {
                if (err) return reject(error(defaultErrorMessage, err));

                Program.updateOne({ _id: project.programRef }, { $push: { projects: project._id } }, (err) => {
                    if (err) return reject(error(defaultErrorMessage, err));

                    Searcher.updateOne({ _id: searcherId }, { $push: { projects: project._id } }, (err) => {
                        if (err) return reject(error(defaultErrorMessage, err));

                        resolve(project);
                    });
                });
            });
        });
    }

    getAllProjectForUser(searcherId) {
        const defaultErrorMessage = "Une erreur est survenue à la lecture de vos projets";
        return new Promise((resolve, reject) => {
            Searcher.findById(searcherId, (err, searcher) => {
                if (err || !searcher) return reject(error(defaultErrorMessage, err));

                searcher
                    .populate({
                        path: "projects",
                        populate: { path: "searchers", select: "name" },
                    })
                    .execPopulate((err, searcherPopulate) => {
                        if (err || !searcherPopulate) return reject(error(defaultErrorMessage, err));

                        const { projects } = searcherPopulate;

                        resolve(projects);
                    });
            });
        });
    }

    deleteById(id) {
        const defaultErrorMessage = "Une erreur est survenue lors de la suppression des tâches du projet";
        return new Promise((resolve, reject) => {
            Project.findByIdAndDelete(id, function (err, project) {
                if (err) return reject(error(defaultErrorMessage, err));

                // supprimer le projet partout
                Searcher.updateMany({ projects: id }, { $pull: { projects: id } }, (err) => {
                    if (err) return reject(error(defaultErrorMessage, err));

                    Program.updateOne({ projects: id }, { $pull: { projects: id } }, (err) => {
                        if (err) return reject(error(defaultErrorMessage, err));

                        new TaskDAO()
                            .deleteByIds(project.tasks)
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                reject(error(defaultErrorMessage, err));
                            });
                    });
                });
            });
        });
    }

    deleteByIds(arrayId) {
        var promises = [];

        for (const id of arrayId) {
            promises.push(this.deleteById(id));
        }

        return Promise.all(promises);
    }

    addSearcherToProject(email, projectId) {
        const defaultErrorMessage = "Une erreur est survenue lors de l'ajout du chercheur au projet";
        const searcherNotFoundErrorMessage = "Le chercheur que vous voulez ajouter n'existe pas";
        return new Promise((resolve, reject) => {
            Searcher.findOneAndUpdate({ email: email }, { $push: { projects: projectId } }, (err, searcher) => {
                if (err) return reject(error(defaultErrorMessage, err));
                if (!searcher) return reject(error(searcherNotFoundErrorMessage));

                Project.updateOne({ _id: projectId }, { $push: { searchers: searcher._id } }, (err) => {
                    if (err) return reject(error(defaultErrorMessage, err));

                    resolve();
                });
            });
        });
    }

    // findById(id) {
    //     return new Promise((resolve, reject) => {
    //         Project.findById(id, async (err, project) => {
    //             if (err) return reject(error("", err));

    //             if (!project) return reject(error());

    //             await project
    //                 .populate("searchers", "name")
    //                 .populate("tasks")
    //                 .execPopulate();

    //             resolve(project);
    //         });
    //     });
    // }
}

module.exports = ProjetDAO;
