/* Modules */
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const sessions = require("client-sessions");
const mongoose = require('mongoose');

/* Middleware */
const app = express();
app.use(express.static('../Public' ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.engine('html', require('ejs').renderFile);
app.set('views', 'views');
app.set('view engine', 'ejs');


const PORT  = 5500;
var Login =  require("./Routes/Connexion/Login");
var Home =  require("./Routes/Home");

/* Routes */
app.use('/', Home);
app.use('/Login', Login);


/* Serveur Start */
var server = app.listen(PORT,'localhost',() => console.log(`Serveur Running on : http://localhost:${PORT}`));
