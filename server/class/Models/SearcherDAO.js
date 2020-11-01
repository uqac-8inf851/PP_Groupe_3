const { Searcher } = require('../../class/Models/Models');
const bcrypt = require('bcryptjs');
const { error } = require('../../utils');

class SearcherDAO {
    
    create(email, password, name) {
        return new Promise((resolve, reject) => {
            
            const newSearcher = new Searcher({
                email,
                password,
                name
            });

            try {
                const salt = bcrypt.genSaltSync(10); // génération sel
                newSearcher.password = bcrypt.hashSync(password, salt); // hachage du mot de passe

                newSearcher.save((err) => {
                    if (err) return reject(error("Erreur lors de l'enregistrement de votre compte.", err));
                    resolve();
                });
            }
            catch (err) {
                return reject(error("Erreur lors de la création de votre compte.", err));
            }
        });
    }

    delete () {

    }

    update () {

    }

    validateConnexion(email, password) {
        return new Promise((resolve, reject) => {
            Searcher.findOne({ email }, (err, searcher) => {
                if (err || !searcher) return reject(error("Votre identifiant ou mot de passe est incorrect.", err));

                try {
                    const passwordValid = bcrypt.compareSync(password, searcher.password);

                    if (passwordValid) {
                        resolve(searcher._id);
                    }
                    else {
                        reject(error("Votre identifiant ou mot de passe est incorrect."));
                    }

                }
                catch (err) {
                    return reject(error("Une erreur est survenue lors de votre connexion, veuillez réessayer plus tard."));
                }
            })
        })
    }
    
    // findNamesById (id_array) {

    //     return new Promise ( res => {

    //         Searcher.find().where('_id').in(id_array).select('name').exec ( (err, results) => {

    //             if (err) res (false)

    //             res (results)
    //         })
    //     })
    // }    
}

module.exports = SearcherDAO;