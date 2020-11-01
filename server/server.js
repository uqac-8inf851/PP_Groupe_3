/* Modules */
const express = require('express');
const bodyParser = require('body-parser');
const sessions = require("client-sessions");

const ConnexionBDMongo = require('./class/Models/ConnexionBDMongo');
const PORT  = 5500;

////////////////////////////////////////////////
/* Initialisation du serveur et des middlewares */
const app = express();
app.use(express.static('./Public'));
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

////////////////////////////////////////////////
/* Mise en place des routes */

const { Login, Register, Programme, Projet, Tache } = require('./routes');

// page d'acceuil
app.get ('/', (req, res) => {
    res.redirect('/Programmes');
})

app.use('/Login', Login);
app.use('/Register', Register);

// Login Middleware
const auth = require('./middleware/auth');
app.get('*', auth);
app.post('*', auth);
///////

app.use('/Programmes', Programme);
app.use('/Projet', Projet);
app.use('/Tache', Tache);

////////////////////////////////////////////////
/* Démarrage du serveur */
const server = app.listen(PORT, 'localhost', () => {
    console.log(`Serveur Running on : http://localhost:${PORT}`)
    ConnexionBDMongo.getInstance();
});