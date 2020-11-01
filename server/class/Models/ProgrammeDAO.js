const { Program } = require('./Models')

const Programme =  require ('./Models').Program

const Searcher =  require ('./Models').Searcher

const ProjectDAO = require('./ProjetDAO')


class ProgrammeDAO {

    #req

    constructor (req) {

        this.#req = req
    }
    
    async create(req) {

        return new Promise ( res => {

            const newPrograme  = new Programme ({
                ...req.body,
                administrator : req.session.searcherId,
            })
    
            newPrograme.save ( (err, prog )=> { 
                
                if ( err) { console.log(err); return res(false) } 

                prog.populate('administrator', 'email').execPopulate().then ( (prog) => {

                    this.addSearcherToProgramme(prog.administrator.email, prog._id).then ( result =>{

                        res (result)
                    })
                })
            })
        })
    }

    async delete (id) {

        return new Promise (async (resolve, reject) => {

            console.log(1)
            Programme.findOneAndDelete({_id : id}, (err, programme ) => {
               
                Searcher.updateMany( {programs : id}, {$pull : {programs : id}}).exec()

                new ProjectDAO().deleteByIds(programme.projects).then(() => {
                    resolve();
                })
                .catch(err => {
                    reject("une erreur est survenue lors de la suppression des tâches du programme");
                });
            })

        })
    }

    update () {

    }

    findById () {

    }
    
    async findAllByUserId (_id) {

        return new Promise (res => {

            Programme.find( {searchers : _id})
            .populate('searchers','name')
            .populate('administrator', 'name')
            .populate('projects')
            .exec( (err, results) => { res({programmes : results , err : err}) })
        })
    }


    async addSearcherToProgramme (email, programeId) {

        return new Promise (res => {

            let update = { $push : {programs : programeId}}

            Searcher.findOneAndUpdate({ email : email },update, (err, User) => { 
        
                if (!User) return res( false )

                let update = { $push : {searchers : User._id}}

                Programme.findByIdAndUpdate(programeId, update).then ((Pro) => { 

                    if (!Pro) return res (false)

                    res (true)
                })
            })
        })
    }
}


module.exports = ProgrammeDAO