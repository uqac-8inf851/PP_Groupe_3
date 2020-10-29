var express = require('express');

const Searcher = require('../../class/Models/Models').Searcher

var router = express.Router();

router.get ('/', (req, res) => {

    res.render('./Connexion/Register.ejs')
})

router.post('/', (req, res) => {

    console.log(req.body);

    const newSearcher = new Searcher(req.body, { strict: true });

    newSearcher.save ( err => { 
        
        if ( err) { console.log(err) 

            let error = "Error Please try again"

            if ( err.code == 11000) { error = "That email is already taken, please try again"}

            return res.render('./Connexion/Register.ejs')
        }
        res.render('./Connexion/Register.ejs');
    })
});

module.exports = router;