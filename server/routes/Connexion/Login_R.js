var express = require('express');

const SearcherDAO = require ("../../class/Models/SearcherDAO")

var router = express.Router();

router.get('/', (req, res) => {

    res.render('./Connexion/Login.ejs');
});

router.post('/', (req, res) => {

    let SearchDAO = new SearcherDAO()

    SearchDAO.ValidateConnexion(req).then ( (status) => {

        if (!status) return res.redirect ('/Login')

        return res.redirect('/Programmes')

    }).catch ( e => console.log(e))

});


module.exports = router

