var express = require('express');

const Programme = require('../../class/Models/Models').Program
const Searcher = require('../../class/Models/Models').Searcher
const ProgrammeDAO = require ('../../class/Models/ProgrammeDAO')

var router = express.Router();

const ProgrammeView = "./Programme/Programme.ejs"
const ProgrammeCreate = "./Programme/ProgrammeCreate.ejs"

router.get ('/', (req, res) => {

    let ProgDao = new ProgrammeDAO (req)

    ProgDao.findAllByUserId().then ( (results) => {

        if (results.err) return res.render('index.ejs', {template : ProgrammeView})
       
        res.render('index.ejs', {Programmes : results.programmes,  template : ProgrammeView})

    }).catch ( e => console.log(e) )

})

router.get ('/Create', (req, res) => {

    res.render('index.ejs',{template : ProgrammeCreate})
})

router.post('/Create', (req, res) => {

    let ProgDAO = new ProgrammeDAO (req)

    ProgDAO.create().then( (result) => { console.log(result)

        res.redirect('/Programmes')

    }).catch ( e => console.log(e)) 
});

router.post ('/AddSearcher', (req, res) => {

    let ProgDAO = new ProgrammeDAO (req)

    ProgDAO.addSearcher().then ( (status) => {

        return res.redirect("/Programmes")

    }).catch ( e => console.log(e) )
    
})

module.exports = router