/* Modules */
const express = require('express');
const bodyParser = require('body-parser');
const sessions = require("client-sessions");

const ConnexionBDMongo = require('./class/Models/ConnexionBDMongo');
const { Searcher } = require("./class/Models/Models");

const {
    Login,
    Register,
    Programme,
    Tache
} = require("./routes");

const PORT  = 5500;

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


/* Routes */
app.use('/Login', Login);
app.use('/Register', Register);
app.use('/Programme', Programme);
app.use('/Tache', Tache);

// Login Middleware
app.get('*', (req, res, next) => {

    if (!(req.session && req.session.searcherId)) return res.redirect('/Login')

    Searcher.findById(req.session.searcherId, (err, searcher) => {

        if (err) { console.error(err); return res.redirect('/Login'); }

        if (!searcher) { return res.redirect('/Login'); }

        next();
    })
});

/* Serveur Start */
const server = app.listen(PORT,'localhost',() => {

    console.log(`Serveur Running on : http://localhost:${PORT}`)

    ConnexionBDMongo.getInstance();
});