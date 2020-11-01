var express = require('express');

const ProgrammeDAO = require ('../../class/Models/ProgrammeDAO')

var router = express.Router();

const ProgrammeView = "./Programme/Programme.ejs"

const ProgrammeCreate = "./Programme/ProgrammeCreate.ejs"

router.get ('/', (req, res) => {

    let ProgDao = new ProgrammeDAO ()

    ProgDao.findAllByUserId(req.session.searcherId).then ( (results) => {

        if (results.err) return res.render('index.ejs', {template : ProgrammeView})
       
        res.render('index.ejs', {Programmes : results.programmes,  template : ProgrammeView})

    }).catch ( e => console.log(e) )

})

router.get ('/Create', (req, res) => {

    res.render('index.ejs',{template : ProgrammeCreate})
})

router.post('/Create', (req, res) => {

    let ProgDAO = new ProgrammeDAO ()

    ProgDAO.create(req).then( (result) => { 

        res.redirect('/Programmes')

    }).catch ( e => console.log(e)) 
});

router.post ('/AddSearcher/:programId', (req, res) => {

    let ProgDAO = new ProgrammeDAO ()

    ProgDAO.addSearcherToProgramme(req.body.email,req.params.programId).then ( (status) => {

        return res.redirect("/Programmes")

    }).catch ( e => console.log(e) )
    
})

router.post ('/delete/:id', (req, res) => {

    let ProgDao = new ProgrammeDAO ()

    ProgDao.delete(req.params.id).then ( (result) => {
        
        res.redirect('/Programmes')

    }).catch( e => console.log(e))
})

module.exports = router