const Programme = require('../../class/Models/Models').Program
const Searcher =  require ('../../class/Models/Models').Searcher


class ProgrammeDAO {

    #req

    constructor (req) {

        this.#req = req
    }
    
    async create() {

        const newPrograme  = new Programme ({
            ...this.#req.body,
            administrator : this.#req.session.searcherId,
            searchers: this.#req.session.searcherId 
        })
    
        return newPrograme.save ( err => { if ( err) { console.log(err) } })
    }

    delete () {

    }

    update () {

    }

    findById () {

    }
    
    async findAllByUserId () {

        return new Promise (res => {
        
            Programme.find( {searchers : this.#req.session.searcherId} , (err, results ) => {

                if (err) console.log(err)

                res( {programmes : results, err: err})
            })
        })
    }

    async addSearcher () {

        return new Promise (res => {

            Searcher.findOne({ email : this.#req.body.email }).select('_id').then ( (User) =>{
        
                if (!User) return res( false )

                let update = { $push : {searchers : User._id}}

                Programme.findByIdAndUpdate(this.#req.body.programeId, update).then ((Pro) => { 

                    if (!Pro) return res (false)

                    res (true)
                })
            })
        })
    }
}

module.exports = ProgrammeDAO