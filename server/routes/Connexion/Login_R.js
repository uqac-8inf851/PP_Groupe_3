var express = require('express');

const Searcher = require('../../class/Models/Models').Searcher

var router = express.Router();

router.get('/', (req, res) => {

    res.render('./Connexion/Login.ejs');
});

router.post('/', (req, res) => {

    Searcher.findOne( {email : req.body.email }, (err, searcher) => {

        if (err || !searcher || req.body.password !== searcher.password ) return res.redirect ('/Login')

        req.session.searcherId = searcher._id

       res.redirect("/Programmes")
    } )

});


module.exports = router

