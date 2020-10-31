const Programme = require('../../class/Models/Models').Program
const Searcher =  require ('../../class/Models/Models').Searcher


class SearcherDAO {

    #req

    constructor (req) {

        this.#req = req
    }
    
    async create(req) {

        return new Promise ( res => {

            const newSearcher  = new Searcher (req.body)

            newSearcher.save ( err => { 
        
                if ( err) return res (false)

                res (true)
            })

        })
    }

    delete () {

    }

    update () {

    }

    async ValidateConnexion (req) {

        return new Promise ( res => {

            Searcher.findOne( {email : req.body.email }, (err, searcher) => {

                if (err || !searcher || req.body.password !== searcher.password ) return res ( false )
        
                req.session.searcherId = searcher._id
        
                return res (true)
            })
        })
    }
    
    async findNamesById (id_array) {

        return new Promise ( res => {

            Searcher.find().where('_id').in(id_array).select('name').exec ( (err, results) => {

                if (err) res (false)

                res (results)
            })
        })
    }

    // RemoveSearcherFromTask()
    
}

module.exports = SearcherDAO