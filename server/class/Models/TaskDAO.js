const { Task, Project, Searcher, Advancement } = require('./Models');

class TaskDAO {
    
    create(searcherId, name, note, startingDate, endingDate, priority, duration, projectId) {
        return new Promise((resolve, reject) => {
            
            const data = {
                name,
                note,
                searchers: [searcherId],
                advancements: [],
                subTasks: [],
                projectRef : projectId
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

            task.save(err => {
                if (err) return reject(err);
                
                Project.updateOne({ _id: task.projectRef }, { $push: { tasks: task._id } }, (err) => { if(err) console.error(err)});
                Searcher.updateOne({ _id: searcherId }, { $push: { tasks: task._id } }, (err) => { if(err) console.error(err)});
                
                resolve(task);
            });
        });        
    }

    findById (id) {
        return new Promise((resolve, reject) => {
            Task.findById(id, async (err, task) => {
                if (err) return reject(err);
                
                if (!task) return reject("La tâche n'existe pas");

                await task.populate('searchers', 'name').execPopulate();

                resolve(task);
            });
        }); 
    }

    getAllTaskForUser(id) {
        return new Promise(async (resolve, reject) => {
            
            const searcher = await Searcher.findById(id);

            if (searcher) {
                
                await searcher.populate({ path: 'tasks', populate: { path: 'searchers', select: 'name' } }).execPopulate();

                const { tasks } = searcher;

                resolve(tasks);
            }
        });
    }
    
    addSearcherToTask(email, taskId) {
        return new Promise(async (resolve, reject) => {
            Searcher.findOneAndUpdate({ email : email },{ $push: { tasks: taskId } }, (err, searcher) => { 
        
                if (err) return reject(err);
                if (!searcher) return reject("Une erreur est survenue à l'ajout du chercheur à la tâche");

                Task.findByIdAndUpdate(taskId, { $push: { searchers: searcher._id } }, (err, project) => {
                    if (err) return reject(err);
                    if (!searcher) return reject("Une erreur est survenue à l'ajout du chercheur à la tâche");

                    resolve();
                });
            })
        });
    }

    deleteById (id) {
        return new Promise((resolve, reject) => {

            Task.findByIdAndDelete(id, function (err, task) {
                if (err) return reject(err);
                
                // supprimer la tâche partout
                Searcher.updateMany({ tasks: id }, { $pull: { tasks: id } }, (err) => { if(err) console.error(err)});
                Advancement.deleteMany({ taskRef: id }, (err) => { if (err) console.error(err) });
                Project.updateOne({ _id: task.projectRef }, { $pull: { tasks: id } }, (err) => { if(err) console.error(err)});

                resolve();
            });
        });
    }

    deleteByIds(arrayId) {
        console.log("on veut supprimer des tasks", arrayId);
        var promises = [];

        for (const id of arrayId) {
            promises.push(this.deleteById(id));
        }

        return Promise.all(promises);
    }
}

module.exports = TaskDAO;