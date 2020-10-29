var express = require('express');

const Programme = require('../../class/Models/Models').Program

var router = express.Router();

router.get ('/Create', (req, res) => {

    // A changer real Page
    res.render('./Connexion/Register.ejs')
})

router.post('/Create', (req, res) => {

    const newPrograme  = new Programme (req.body)

    newPrograme.save ( err => { if ( err) { console.log(err) } })

    // A changer real Page
    res.render('./Connexion/Register.ejs')
});

module.exports = router