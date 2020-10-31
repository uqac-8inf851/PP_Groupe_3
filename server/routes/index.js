const Login = require('./Connexion/Login_R');
const Register = require('./Connexion/Register_R');

const Programme = require('./Programme/Programme_R');

const Tache = require('./Tache/Tache_R');
const TacheDev = require('./Tache/Tache_R.dev');

module.exports = {
    Login,
    Register,
    Programme,
    Tache,
    TacheDev
}