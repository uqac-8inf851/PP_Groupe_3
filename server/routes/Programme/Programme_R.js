var express = require('express');

const Programme = require('../../class/Models/Models').Program
const Searcher = require('../../class/Models/Models').Searcher

var router = express.Router();

router.get ('/', (req, res) => {

    Programme.find( {searchers : req.session.searcherId} , (err, programmes ) => {

        if (err) console.log(err)
    })

    res.render('./Programme/Programme.ejs')
})

router.get ('/Create', (req, res) => {

    res.render('./Programme/ProgrammeCreate.ejs')
})

router.post('/Create', (req, res) => {

    const newPrograme  = new Programme ({
        ...req.body,
        administrator : req.session.searcherId,
        searches: req.session.searcherId 
    })

    newPrograme.save ( err => { if ( err) { console.log(err) } })

    res.render('./Programme/Programme.ejs')
});

router.post ('/AddSearcher', (req, res) => {

    Searcher.findOne({ email : req.body.email }).select('_id').then ( (User) =>{

        if (!User) return res.render('./Programme/Programme.ejs')

        let update = { $push : {searchers : User._id}}

        Programme.findByIdAndUpdate(req.body.programeId, update).then ((Pro) => {
        
            console.log(Pro)
        })

        res.render('./Programme/Programme.ejs')

    }).catch( (e) => console.log(e) )
    
})
module.exports = router