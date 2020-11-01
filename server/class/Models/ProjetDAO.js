const { Program, Project, Searcher } = require('./Models');
const TaskDAO = require('./TaskDAO');

class ProjetDAO {
    
    create(searcherId, name, description, programId) {
        return new Promise((resolve, reject) => {
            
            const data = {
                name,
                description,
                searchers: [searcherId],
                programRef : programId
            };

            const project = new Project(data);

            project.save(err => {
                if (err) return reject(err);
                
                Program.updateOne({ _id: project.programRef }, { $push: { projects: project._id } }, (err) => { if(err) console.error(err)});
                Searcher.updateOne({ _id: searcherId }, { $push: { projects: project._id } }, (err) => { if(err) console.error(err)});
                
                resolve(project);
            });
        });        
    }

    findById (id) {
        return new Promise((resolve, reject) => {
            Project.findById(id, async (err, project) => {
                if (err) return reject(err);
                
                if (!project) return reject("Le projet n'existe pas");

                await project.populate('searchers', 'name').populate('tasks').execPopulate();

                resolve(project);
            });
        }); 
    }

    getAllProjectForUser(searcherId) {
        return new Promise(async (resolve, reject) => {
            
            const searcher = await Searcher.findById(searcherId);

            if (searcher) {
                
                await searcher.populate({ path: 'projects', populate: { path: 'searchers', select: 'name' } }).execPopulate();

                const { projects } = searcher;

                resolve(projects);
            }
        });
    }

    deleteById (id) {
        return new Promise(async (resolve, reject) => {

            Project.findByIdAndDelete(id, function (err, project) {
                if (err) return reject(err);
                
                // supprimer le projet partout
                Searcher.updateMany({ projects: id }, { $pull: { projects: id } }, (err) => { if (err) console.error(err) });
                Program.updateOne({ projects: id }, { $pull: { projects: id } }, (err) => { if (err) console.error(err) });
                
                new TaskDAO().deleteByIds(project.tasks).then(() => {
                    resolve();
                })
                .catch(err => {
                    reject("une erreur est survenue lors de la suppression des tâches du projet");
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
        return new Promise(async (resolve, reject) => {
            Searcher.findOneAndUpdate({ email : email },{ $push: { projects: projectId } }, (err, searcher) => { 
        
                if (err) return reject(err);
                if (!searcher) return reject("Une erreur est survenue à l'ajout du chercheur au projet");

                Project.findByIdAndUpdate(projectId, { $push: { searchers: searcher._id } }, (err, project) => {
                    if (err) return reject(err);
                    if (!searcher) return reject("Une erreur est survenue à l'ajout du chercheur au projet");

                    resolve();
                });
            })
        });
    }
}


module.exports = ProjetDAO;