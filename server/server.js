/* Modules */
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const sessions = require("client-sessions");
const mongoose = require('mongoose');

const ConnexionBDMongo = require('./class/Models/ConnexionBDMongo');
const Searcher = require("./class/Models/Models").Searcher

/* Middleware */
const app = express();
app.use(express.static('./Public' ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(
    sessions({
    cookieName: "session",
    secret: "PPratiqueGenie",
    duration: 5 * 60 * 10000,
    httpOnly: true,
    ephemeral: true
  }))

app.engine('html', require('ejs').renderFile);
app.set('views', './Public/views');
app.set('view engine', 'ejs');

const PORT  = 5500;

/* Serveur Start */
var server = app.listen(PORT,'localhost',() => {

    console.log(`Serveur Running on : http://localhost:${PORT}`)

    ConnexionBDMongo.getInstance()
    

});



var Login =  require("./routes/Connexion/Login_R");
var Register =  require("./routes/Connexion/Register_R");

/* Routes */
app.use('/Login', Login);
app.use('/Register', Register);

// Login Middleware
app.get('*',(req, res, next) => {

    if (!(req.session && req.session.userId)) return res.redirect('/Login')

    Searcher.findById(req.session.searcherId, (err, searcher) => {

        if (err) { console.log(err); return res.redirect('/Login') } 

        if ( !searcher) { return res.redirect('/Login') }

        next()
    })  
})


