var express = require('express');

const Programme = require('../../class/Models/Models').Program
const Searcher = require('../../class/Models/Models').Searcher

var router = express.Router();

const ProgrammeView = "./Programme/Programme.ejs"
const ProgrammeCreate = "./Programme/ProgrammeCreate.ejs"

router.get ('/', (req, res) => {

    Programme.find( {searchers : req.session.searcherId} , (err, programmes ) => {

        if (err) {console.log(err); return res.render('index.ejs', {Programmes : [], template : ProgrammeView}) }

        res.render('index.ejs', {Programmes : programmes, template : ProgrammeView })
    })
})

router.get ('/Create', (req, res) => {

    res.render('index.ejs',{template : ProgrammeCreate})
})

router.post('/Create', (req, res) => {

    const newPrograme  = new Programme ({
        ...req.body,
        administrator : req.session.searcherId,
        searchers: req.session.searcherId 
    })

    newPrograme.save ( err => { if ( err) { console.log(err) } })

    res.render('index.ejs', {template : ProgrammeView})
});

router.post ('/AddSearcher', (req, res) => {

    Searcher.findOne({ email : req.body.email }).select('_id').then ( (User) =>{

        if (!User) return res.render('./Programme/Programme.ejs')

        let update = { $push : {searchers : User._id}}

        Programme.findByIdAndUpdate(req.body.programeId, update).then ((Pro) => { })

        res.render('./Programme/Programme.ejs')

    }).catch( (e) => console.log(e) )
    
})

module.exports = router