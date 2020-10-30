var express = require('express');

const Searcher = require('../../class/Models/Models').Searcher
const SearcherDAO = require ("../../class/Models/SearcherDAO")

var router = express.Router();

router.get ('/', (req, res) => {

    res.render('./Connexion/Register.ejs')
})

router.post('/', (req, res) => {

    let SearchDAO = new SearcherDAO(req)

    SearchDAO.create().then ( (status) => {

        if (!status) return res.render('./Connexion/Register.ejs')

        res.redirect('/Login')

    }).catch ( e => console.log(e) )

});

module.exports = router