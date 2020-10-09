/* Modules */
const express = require('express')
const bodyParser = require('body-parser')
const sessions = require("client-sessions")
const mongoose = require('mongoose')

/* Middleware */
const app = express()
app.use(express.static('../Public' ))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.engine('html', require('ejs').renderFile);
app.set('views', '../Public/ejs');
app.set('view engine', 'ejs')


var Login =  require("./Routes/Connexion/Login")

/* Routes */
app.use('/Login', Login) 


/* Serveur Start */
var server = app.listen(5500,'localhost',() => console.log("Serveur Running"))

app.get('/', function (req, res) {
    res.render("Home");
})