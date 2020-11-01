const { error } = require("../../utils");
const { Program, Searcher } = require("../Models/Models");
const ProjectDAO = require("../Dao/ProjetDAO");

class ProgrammeDAO {
    create(name, description, searcherId) {
        const defaultErrorMessage = "Une erreur est survenue lors de la création du programme";
        return new Promise((resolve, reject) => {
            const newPrograme = new Program({
                name,
                description,
                administrator: searcherId,
            });

            newPrograme.save((err, programme) => {
                if (err) return reject(error(defaultErrorMessage, err));

                programme.populate("administrator", "email").execPopulate((err, programmePopulate) => {
                    if (err || !programmePopulate) return reject(error(defaultErrorMessage, err));

                    this.addSearcherToProgramme(programmePopulate.administrator.email, programmePopulate._id)
                        .then((result) => {
                            resolve(result);
                        })
                        .catch((err) => {
                            reject(error(defaultErrorMessage, err));
                        });
                });
            });
        });
    }

    delete(id) {
        const defaultErrorMessage = "Une erreur est survenue lors de la suppression du programme";
        return new Promise((resolve, reject) => {
            Program.findOneAndDelete({ _id: id }, (err, programme) => {
                if (err) return reject(error(defaultErrorMessage, err));

                Searcher.updateMany({ programs: id }, { $pull: { programs: id } }, (err) => {
                    if (err) return reject(error(defaultErrorMessage, err));

                    new ProjectDAO()
                        .deleteByIds(programme.projects)
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {
                            return reject(error(defaultErrorMessage, err));
                        });
                });
            });
        });
    }

    // async delete(id) {
    //     return new Promise(async (resolve, reject) => {
    //

    //         });
    //     });
    // }

    update() {}

    findById() {}

    findAllByUserId(id) {
        const defaultErrorMessage = "Une erreur est survenue lors de la lecture de vos programmes";
        return new Promise((resolve, reject) => {
            Program.find({ searchers: id })
                .populate("searchers", "name")
                .populate("administrator", "name")
                .populate({
                    path: "projects",
                    populate: { path: "searchers", select: "name" },
                })
                .exec((err, programmes) => {
                    if (err || !programmes) return reject(error(defaultErrorMessage, err));

                    resolve(programmes);
                });
        });
    }

    addSearcherToProgramme(email, programeId) {
        const defaultErrorMessage = "Une erreur est survenue lors de l'ajout du chercheur au programme";
        const searcherNotFoundErrorMessage = "Le chercheur que vous voulez ajouter n'existe pas";
        return new Promise((resolve, reject) => {
            const update = { $push: { programs: programeId } };

            Searcher.findOneAndUpdate({ email: email }, update, (err, searcher) => {
                if (err) return reject(error(defaultErrorMessage, err));
                if (!searcher) return reject(error(searcherNotFoundErrorMessage));

                const update = { $push: { searchers: searcher._id } };

                Program.updateOne({ _id: programeId }, update, (err) => {
                    if (err) return reject(error(defaultErrorMessage, err));

                    resolve();
                });
            });
        });
    }
}

module.exports = ProgrammeDAO;
