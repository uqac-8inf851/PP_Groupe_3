const Programme = require('../../class/Models/Models').Program
const Searcher =  require ('../../class/Models/Models').Searcher


class SearcherDAO {

    #req

    constructor (req) {

        this.#req = req
    }
    
    async create() {

        return new Promise ( res => {

            const newSearcher  = new Searcher (this.#req.body)

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

    async findById () {

        return new Promise ( res => {

            Searcher.findOne( {email : this.#req.body.email }, (err, searcher) => {

                if (err || !searcher || this.#req.body.password !== searcher.password ) return res ( false )
        
                this.#req.session.searcherId = searcher._id
        
                return res (true)
            })
        })
    }
    
}

module.exports = SearcherDAO