const { Task, Project, Searcher, Advancement } = require("../Models/Models");
const { error } = require("../../utils");

class TaskDAO {
    create(searcherId, name, note, startingDate, endingDate, priority, duration, projectId) {
        const defaultErrorMessage = "Une erreur est survenue lors de la création de la tâche";
        return new Promise((resolve, reject) => {
            const data = {
                name,
                note,
                searchers: [searcherId],
                advancements: [],
                subTasks: [],
                projectRef: projectId,
            };

            data.priority = Number(priority);

            if (duration !== null && duration !== "") {
                data.duration = Number(duration);
            }

            if (startingDate !== null && startingDate !== "") {
                data.startingDate = new Date(Number(startingDate));
                data.elapsedDuration = 0;
            }

            if (endingDate !== null && endingDate !== "") {
                data.endingDate = new Date(Number(endingDate));
                data.elapsedDuration = 0;
            }

            const task = new Task(data);

            task.save((err) => {
                if (err) return reject(error(defaultErrorMessage, err));

                Project.updateOne({ _id: task.projectRef }, { $push: { tasks: task._id } }, (err) => {
                    if (err) return reject(error(defaultErrorMessage, err));

                    Searcher.updateOne({ _id: searcherId }, { $push: { tasks: task._id } }, (err) => {
                        if (err) return reject(error(defaultErrorMessage, err));

                        resolve(task);
                    });
                });
            });
        });
    }

    getAllTaskForUser(id) {
        const defaultErrorMessage = "Une erreur est survenue lors de la lecture de vos tâches";
        return new Promise((resolve, reject) => {
            Searcher.findById(id, (err, searcher) => {
                if (err || !searcher) return reject(error(defaultErrorMessage, err));

                searcher
                    .populate({
                        path: "tasks",
                        populate: { path: "searchers", select: "name" },
                    })
                    .execPopulate((err, searcherPopulated) => {
                        if (err || !searcherPopulated) return reject(error(defaultErrorMessage, err));

                        const { tasks } = searcher;

                        resolve(tasks);
                    });
            });
        });
    }

    addSearcherToTask(email, taskId) {
        const defaultErrorMessage = "Une erreur est survenue à l'ajout du chercheur à la tâche";
        const searcherNotFoundErrorMessage = "Le chercheur que vous voulez ajouter n'existe pas";
        return new Promise((resolve, reject) => {
            Searcher.findOneAndUpdate({ email: email }, { $addToSet: { tasks: taskId } }, (err, searcher) => {
                if (err) return reject(error(defaultErrorMessage, err));
                if (!searcher) return reject(error(searcherNotFoundErrorMessage));

                Task.updateOne({ _id: taskId }, { $addToSet: { searchers: searcher._id } }, (err) => {
                    if (err) return reject(error(defaultErrorMessage, err));
                    resolve();
                });
            });
        });
    }

    deleteById(id) {
        const defaultErrorMessage = "Une erreur est survenue lors de la suppression du programme";
        return new Promise((resolve, reject) => {
            Task.findByIdAndDelete(id, function (err, task) {
                if (err || !task) return reject(error(defaultErrorMessage, err));

                // supprimer la tâche partout
                Searcher.updateMany({ tasks: id }, { $pull: { tasks: id } }, (err) => {
                    if (err) return reject(error(defaultErrorMessage, err));

                    Project.updateOne({ _id: task.projectRef }, { $pull: { tasks: id } }, (err) => {
                        if (err) return reject(error(defaultErrorMessage, err));

                        Advancement.deleteMany({ taskRef: id }, (err) => {
                            if (err) return reject(error(defaultErrorMessage, err));

                            resolve();
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

    // findById(id) {
    //     return new Promise((resolve, reject) => {
    //         Task.findById(id, async (err, task) => {
    //             if (err) return reject(err);

    //             if (!task) return reject("La tâche n'existe pas");

    //             await task.populate("searchers", "name").execPopulate();

    //             resolve(task);
    //         });
    //     });
    // }
}

module.exports = TaskDAO;